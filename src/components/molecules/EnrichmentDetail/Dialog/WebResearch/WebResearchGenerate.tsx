import { useWebResearchStore } from '@/stores/enrichment';
import { Box, ClickAwayListener, Icon, Stack, Typography } from '@mui/material';
import { Editor } from '@tiptap/core';
import Image from 'next/image';
import { FC, useCallback, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { PromptEditor } from './PromptEditor';
import { StyledActionItem, StyledSearchInput } from '../Common';
import { StyledProviderBadges } from '../DialogActionsMenu/base';

import { insertWithPlaceholders } from '@/utils';

import { useLocalSearch, useSwitch, useVariableFromStore } from '@/hooks';

import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import ICON_SPARK_OUTLINE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_outline.svg';
import { ActionsTypeKeyEnum } from '@/types';

interface WebResearchGenerateProps {
  handleGeneratePrompt?: () => void;
  isLoading?: boolean;
  onPromptEditorReady?: (editor: Editor) => void;
}

export const WebResearchGenerate: FC<WebResearchGenerateProps> = ({
  handleGeneratePrompt,
  isLoading,
  onPromptEditorReady,
}) => {
  const promptEditorRef = useRef(null);
  const { generateDescription, setGenerateEditorInstance, runGenerateAiModel } =
    useWebResearchStore(
      useShallow((state) => ({
        generateDescription: state.generateDescription,
        setGenerateEditorInstance: state.setGenerateEditorInstance,
        runGenerateAiModel: state.runGenerateAiModel,
      })),
    );
  const { suggestions } = useActionsStore(
    useShallow((store) => ({
      suggestions: store.suggestionsList,
    })),
  );
  const { filedMapping } = useVariableFromStore();
  const { visible, open, close } = useSwitch(false);

  const handleEditorReady = useCallback(
    (editor: Editor) => {
      setGenerateEditorInstance(editor);
      onPromptEditorReady?.(editor);
    },
    [setGenerateEditorInstance, onPromptEditorReady],
  );

  const defaultValue = generateDescription
    ? insertWithPlaceholders(generateDescription, filedMapping)
    : null;

  const filteredSuggestions = useMemo(
    () =>
      suggestions
        .filter((item) => item.key === ActionsTypeKeyEnum.ai_template)
        .slice(0, 6),
    [suggestions],
  );

  const {
    debouncedSetSearch,
    resetSearch,
    searchResults,
    text,
    setText,
    hasSearchValue,
  } = useLocalSearch(filteredSuggestions);

  const onSearchChange = useCallback(
    (value: string) => {
      setText(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch, setText],
  );

  return (
    <Stack gap={1.5}>
      <StyledSearchInput
        onChange={onSearchChange}
        onClear={resetSearch}
        value={text}
      />
      <Typography variant={'body2'}>
        Tasks Atlas recommends based on your current table
      </Typography>
      <Stack gap={1.5}>
        {searchResults.length === 0 && hasSearchValue ? (
          <Typography
            color={'text.secondary'}
            fontSize={12}
            textAlign={'center'}
          >
            No results found.
          </Typography>
        ) : (
          (hasSearchValue ? searchResults : filteredSuggestions).map(
            (item, index) => (
              <StyledActionItem
                badges={
                  <StyledProviderBadges
                    providers={(item.waterfallConfigs || []).map(
                      (config) => config.logoUrl,
                    )}
                  />
                }
                description={item.description}
                icon={
                  <Image
                    alt={'Provider '}
                    height={16}
                    src={item.logoUrl}
                    width={16}
                  />
                }
                key={index}
                onClick={async () => {
                  const description =
                    (item.description ?? '') || (item.shortDescription ?? '');
                  await runGenerateAiModel('/aiResearch/generate/stream', {
                    params: {
                      userInput: `Name:${item.name},Description:${description}`,
                    },
                  });
                }}
                title={item.name}
              />
            ),
          )
        )}
      </Stack>
      <ClickAwayListener onClickAway={close}>
        <Stack
          border={'1px solid'}
          borderColor={visible ? 'text.primary' : '#F0F0F4'}
          borderRadius={2}
          onClick={open}
          px={1.5}
          py={1}
          sx={{
            cursor: visible ? 'text' : 'pointer',
            '&:hover': {
              borderColor: 'text.primary',
            },
          }}
        >
          <Stack gap={0.5}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
              <Icon
                component={ICON_SPARK_OUTLINE}
                sx={{ width: 16, height: 16 }}
              />
              <Typography variant={'body2'}>Describe your own task</Typography>
            </Stack>
            <Typography
              color={'text.secondary'}
              fontWeight={400}
              variant={'body3'}
            >
              {visible
                ? 'Tell Atlas what you need, and it will generate an optimized prompt with the right settings.'
                : 'Describe the task, and Atlas will craft an optimized prompt and choose the right settings.'}
            </Typography>
          </Stack>
          {visible && (
            <Stack position={'relative'} zIndex={1}>
              <Box bgcolor={'#DFDEE6'} height={'1px'} my={1} />
              <PromptEditor
                defaultValue={defaultValue}
                handleGenerate={handleGeneratePrompt}
                isLoading={isLoading}
                onEditorReady={handleEditorReady}
                placeholder={'e.g. Find the CEO of this company'}
                ref={promptEditorRef}
              />
            </Stack>
          )}
        </Stack>
      </ClickAwayListener>
    </Stack>
  );
};

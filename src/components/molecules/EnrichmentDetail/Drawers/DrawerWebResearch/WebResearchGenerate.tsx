import { useWebResearchStore } from '@/stores/enrichment';
import { Box, ClickAwayListener, Stack, Typography } from '@mui/material';
import { Editor } from '@tiptap/core';
import Image from 'next/image';
import { FC, useCallback, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  ExtensionMention,
  ExtensionNode,
  ExtensionStorage,
} from './extensions';
import { StyledActionItem, StyledSearchInput } from '../Common';
import { StyledProviderBadges } from '../DrawerActionsMenu/base';
import { StyledTiptapEditor } from '@/components/atoms';

import { ActionsTypeKeyEnum, IntegrationActionMenu } from '@/types';
import { insertWithPlaceholders } from '@/utils';

import { useSwitch } from '@/hooks';
import {
  useFieldMapping,
  useLocalSearch,
} from '@/components/molecules/EnrichmentDetail/hooks';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { DrawersIconConfig } from '../DrawersIconConfig';

interface WebResearchGenerateProps {
  onClickToGeneratePrompt?: () => void;
  isLoading?: boolean;
  onPromptEditorReady?: (editor: Editor) => void;
}

export const WebResearchGenerate: FC<WebResearchGenerateProps> = ({
  onClickToGeneratePrompt,
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
  const { suggestions, setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((store) => ({
      suggestions: store.suggestionsList,
      setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
    })),
  );
  const { filedMapping } = useFieldMapping();
  const { visible, open, close } = useSwitch(false);

  const onEditorReady = useCallback(
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

  const handleItemClick = useCallback(
    async (item: IntegrationActionMenu) => {
      const description =
        (item.description ?? '') || (item.shortDescription ?? '');
      const userInput = `Name:${item.name},Description:${description}`;
      await runGenerateAiModel('/aiResearch/generate/stream', {
        params: {
          userInput,
        },
      });
    },
    [runGenerateAiModel],
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
                onClick={() => handleItemClick(item)}
                title={item.name}
              />
            ),
          )
        )}
        <Typography
          onClick={() => {
            setDialogAllEnrichmentsVisible(true);
          }}
          sx={{ color: '#5878D2', cursor: 'pointer' }}
          variant={'body2'}
        >
          View more tasks
        </Typography>
        <Box sx={{ width: '100%', height: '1px', bgcolor: '#F0F0F4' }} />
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
              <DrawersIconConfig.SparkleOutline size={16} />
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
              <StyledTiptapEditor
                defaultValue={defaultValue}
                extensions={[ExtensionMention, ExtensionNode, ExtensionStorage]}
                isLoading={isLoading}
                onClickToGenerate={onClickToGeneratePrompt}
                onEditorReady={onEditorReady}
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

import { useWebResearchStore } from '@/stores/enrichment';
import { Box, ClickAwayListener, Icon, Stack, Typography } from '@mui/material';
import { Editor } from '@tiptap/core';
import { FC, useCallback, useRef } from 'react';
import Image from 'next/image';

import { PromptEditor } from './PromptEditor';

import { insertWithPlaceholders } from '@/utils';

import { useSwitch, useVariableFromStore } from '@/hooks';

import ICON_SPARK_OUTLINE from '../assets/dialog/icon_sparkle_outline.svg';
import { StyledActionItem, StyledSearchInput } from '../Dialog/Common';
import { useDialogHeaderActionsHook } from '../Dialog/DialogHeaderActions/hooks';
import { StyledProviderBadges } from '../Dialog/DialogActionsMenu/base';

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
  const { generateDescription, setGenerateEditorInstance } =
    useWebResearchStore((state) => state);
  const { ENRICHMENTS_SUGGESTION_MENUS } = useDialogHeaderActionsHook();
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

  return (
    <Stack gap={1.5}>
      <StyledSearchInput
        // onChange={setSearchValue}
        placeholder={'Search tasks'}
        // value={searchValue}
      />
      <Typography variant={'body2'}>
        Tasks Atlas recommends based on your current table
      </Typography>
      <Stack gap={1.5}>
        {ENRICHMENTS_SUGGESTION_MENUS.children.map((item, index) => (
          <StyledActionItem
            badges={
              <StyledProviderBadges
                providers={item.waterfallConfigs.map(
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
            onClick={item.onClick}
            title={item.name}
          />
        ))}
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

import { Stack, Typography } from '@mui/material';
import { TiptapEditor } from './TiptapEditor';
import { FC, useEffect, useRef } from 'react';
import { useWebResearchStore } from '@/stores/Prospect';
import { Editor } from '@tiptap/core';

type WebResearchGenerateProps = {
  handleGeneratePrompt?: () => void;
  isLoading?: boolean;
  onPromptEditorReady?: (editor: any) => void;
};

export const WebResearchGenerate: FC<WebResearchGenerateProps> = ({
  handleGeneratePrompt,
  isLoading,
  onPromptEditorReady,
}) => {
  const promptEditorRef = useRef(null);
  const {
    generateDescription,
    setGenerateEditorInstance,
    generateEditorInstance,
  } = useWebResearchStore((state) => state);

  const handleEditorReady = (editor: Editor) => {
    setGenerateEditorInstance(editor);
    onPromptEditorReady?.(editor);
  };

  return (
    <Stack gap={1.5}>
      <Stack gap={1}>
        <Typography fontWeight={600}>What would you like Al to do?</Typography>
        <Typography fontWeight={400} variant={'subtitle2'}>
          Describe what data you want to research or generate using AI. The
          system will write an optimized prompt and configure the appropriate
          settings.
        </Typography>
      </Stack>
      <TiptapEditor
        defaultValue={generateDescription}
        handleGenerate={handleGeneratePrompt}
        isLoading={isLoading}
        onEditorReady={handleEditorReady}
        placeholder={
          'E.g., Find the CEO of the company and their Linkedin profile'
        }
        ref={promptEditorRef}
      />
    </Stack>
  );
};

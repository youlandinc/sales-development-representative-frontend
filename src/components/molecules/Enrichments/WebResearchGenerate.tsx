import { Stack, Typography } from '@mui/material';
import { TiptapEditor } from './TiptapEditor';
import { FC } from 'react';

type WebResearchGenerateProps = {
  handleGeneratePrompt?: () => void;
  isLoading?: boolean;
};

export const WebResearchGenerate: FC<WebResearchGenerateProps> = ({
  handleGeneratePrompt,
  isLoading,
}) => {
  return (
    <Stack gap={1.5}>
      <Stack gap={1}>
        <Typography fontWeight={600}>What would you like Al to do?</Typography>
        <Typography fontWeight={400} variant={'subtitle1'}>
          Describe what data you want to research or generate using AI. The
          system will write an optimized prompt and configure the appropriate
          settings.
        </Typography>
      </Stack>
      <TiptapEditor
        handleGenerate={handleGeneratePrompt}
        isLoading={isLoading}
        placeholder={
          'E.g., Find the CEO of the company and their Linkedin profile'
        }
      />
    </Stack>
  );
};

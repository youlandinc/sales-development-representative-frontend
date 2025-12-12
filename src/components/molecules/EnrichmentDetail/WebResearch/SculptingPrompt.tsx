import { CircularProgress, Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface SculptingPromptProps {
  prompt: string;
  isLoading?: boolean;
  schemaJsonStr: string;
  taskContent: string;
  suggestedModelContent: string;
}

const TITLE_DEFAULT_STYLE = {
  color: '#A4A4A4',
  fontSize: 14,
  lineHeight: 1.2,
  fontWeight: 600,
};

const INSTRUCTIONS_DEFAULT_STYLE = {
  color: 'text.secondary',
  fontSize: 14,
  lineHeight: 1.4,
  whiteSpace: 'pre-wrap',
};

export const SculptingPrompt: FC<SculptingPromptProps> = ({
  prompt,
  isLoading,
  schemaJsonStr,
  taskContent,
  suggestedModelContent,
}) => {
  if (isLoading) {
    return (
      <Stack alignItems={'center'} gap={2} justifyContent={'center'}>
        <Typography variant={'body2'}>Sculpting your prompt...</Typography>
        <CircularProgress size={20} />
      </Stack>
    );
  }
  return (
    <Stack flex={1} gap={3}>
      {/* <Typography variant={'body2'}>Sculpting your prompt...</Typography> */}
      <Stack gap={0.5}>
        <Typography sx={TITLE_DEFAULT_STYLE}>Task</Typography>
        {taskContent && (
          <Typography sx={INSTRUCTIONS_DEFAULT_STYLE}>{taskContent}</Typography>
        )}
      </Stack>
      {suggestedModelContent && (
        <Stack gap={0.5}>
          <Typography sx={TITLE_DEFAULT_STYLE}>Suggested model</Typography>
          <Typography sx={INSTRUCTIONS_DEFAULT_STYLE}>
            {suggestedModelContent}
          </Typography>
        </Stack>
      )}
      {prompt && (
        <Stack gap={0.5}>
          <Typography sx={TITLE_DEFAULT_STYLE}>
            Suggested instructions
          </Typography>
          <Typography
            border={'1px solid #E5E5E5'}
            borderRadius={2}
            p={2}
            sx={INSTRUCTIONS_DEFAULT_STYLE}
          >
            {prompt}
          </Typography>
        </Stack>
      )}
      {schemaJsonStr && (
        <Stack gap={0.5}>
          <Typography sx={TITLE_DEFAULT_STYLE}>
            Suggested output format
          </Typography>
          <Typography sx={INSTRUCTIONS_DEFAULT_STYLE}>
            {schemaJsonStr}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

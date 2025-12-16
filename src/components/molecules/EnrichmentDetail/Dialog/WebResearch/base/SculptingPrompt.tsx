import { CircularProgress, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef } from 'react';

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [taskContent, suggestedModelContent, prompt, schemaJsonStr]);

  if (isLoading) {
    return (
      <Stack alignItems={'center'} gap={2} justifyContent={'center'}>
        <Typography variant={'body2'}>Sculpting your prompt...</Typography>
        <CircularProgress size={20} />
      </Stack>
    );
  }
  return (
    <Stack flex={1} gap={3} sx={{ overflowY: 'auto' }}>
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
            border={'1px solid #DFDEE6'}
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
      <div ref={bottomRef} />
    </Stack>
  );
};

import { Stack, Typography } from '@mui/material';
import { TiptapEditor } from './TiptapEditor';

export const UseAiGenerate = () => {
  return (
    <Stack gap={1.5}>
      <Stack gap={1}>
        <Typography fontWeight={600}>What would you like Al to do?</Typography>
        <Typography variant={'subtitle1'} fontWeight={400}>
          Describe what data you want to research or generate using AI. The
          system will write an optimized prompt and configure the appropriate
          settings.
        </Typography>
      </Stack>
      <TiptapEditor />
    </Stack>
  );
};

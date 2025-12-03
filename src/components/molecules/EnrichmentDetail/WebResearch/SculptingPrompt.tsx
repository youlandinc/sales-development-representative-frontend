import { CircularProgress, Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface SculptingPromptProps {
  prompt: string;
  isLoading?: boolean;
  schemaJsonStr: string;
}
export const SculptingPrompt: FC<SculptingPromptProps> = ({
  prompt,
  isLoading,
  schemaJsonStr,
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
    <Stack flex={1} gap={4}>
      <Typography variant={'body2'}>Sculpting your prompt...</Typography>
      <Stack gap={0.5}>
        <Typography variant={'body2'}>Suggested use case</Typography>
        <Typography variant={'body2'}>
          The user prompt is requesting to find specific information about a
          person, likely using dynamic fields (placeholders) that will be
          replaced with actual data. The available columns suggest the task
          involves searching for or extracting information such as Linkedlin
          profiles, job titles, or other personal/professional details. This
          type of task typically requires web browsing or scraping to retrieve
          up-to-date or structured data about individuals, which aligns with the
          capabilities of Attunegent. Therefore, Attunegent is the most
          appropriate use case.
        </Typography>
      </Stack>
      <Stack gap={0.4}>
        <Typography variant={'body2'}>Suggested prompt</Typography>
        <Typography
          border={'1px solid #E5E5E5'}
          borderRadius={2}
          p={2}
          variant={'body3'}
        >
          {prompt}
        </Typography>
      </Stack>
      <Stack gap={0.4}>
        <Typography variant={'body2'}>Suggested output format </Typography>
        <Typography p={2} variant={'body3'}>
          {schemaJsonStr}
        </Typography>
      </Stack>
    </Stack>
  );
};

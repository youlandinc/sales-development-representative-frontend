import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

type SettingsCardProps = {
  title?: ReactNode;
};

export const SettingsCard: FC<PropsWithChildren<SettingsCardProps>> = ({
  title,
  children,
}) => {
  return (
    <Stack border={'1px solid #E5E5E5'} borderRadius={4} gap={3} p={3}>
      <Typography component={'div'} lineHeight={1.2} variant={'h6'}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
};

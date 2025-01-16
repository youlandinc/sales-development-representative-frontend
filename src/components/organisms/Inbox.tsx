import { FC } from 'react';
import { Box, Stack } from '@mui/material';

import { InboxContent, InboxSide } from '@/components/molecules';
import { StyledButton, StyledTextField } from '@/components/atoms';

export const Inbox: FC = () => {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'#E5E5E5'}
      borderRadius={4}
      flex={1}
      flexDirection={'row'}
    >
      <InboxSide />
      <InboxContent />
    </Stack>
  );
};

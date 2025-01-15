import { FC } from 'react';
import { Stack } from '@mui/material';

import { InboxContent, InboxSide } from '@/components/molecules';

export const Inbox: FC = () => {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'#E5E5E5'}
      borderRadius={4}
      flexDirection={'row'}
      mb={3}
      mt={6}
    >
      <InboxSide />
      <InboxContent />
    </Stack>
  );
};

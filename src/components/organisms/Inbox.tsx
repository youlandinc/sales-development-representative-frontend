import { FC } from 'react';
import { Stack } from '@mui/material';

import { InboxContent, InboxSide } from '@/components/molecules';

export const Inbox: FC = () => {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'#DFDEE6'}
      borderRadius={4}
      flex={1}
      flexDirection={'row'}
    >
      <InboxSide />
      <InboxContent />
    </Stack>
  );
};

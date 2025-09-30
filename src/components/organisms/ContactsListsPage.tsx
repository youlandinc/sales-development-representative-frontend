import { Stack } from '@mui/material';

import { GridSegments, HeaderSegments } from '@/components/molecules';

export const ContactsListsPage = () => {
  return (
    <Stack gap={3} height={'100%'} overflow={'auto'}>
      <HeaderSegments />
      <GridSegments />
    </Stack>
  );
};

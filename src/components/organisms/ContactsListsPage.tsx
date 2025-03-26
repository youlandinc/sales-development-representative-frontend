import { Stack } from '@mui/material';

import { GridSegments, HeaderSegments } from '@/components/molecules';

export const ContactsListsPage = () => {
  return (
    <Stack gap={3} height={'100%'} overflow={'auto'} px={8} py={6}>
      <HeaderSegments />
      <GridSegments />
    </Stack>
  );
};

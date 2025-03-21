import { FC, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import { ContactsHeader, GridContacts } from '@/components/molecules';

import { ContactsPageMode, ContactsTableTypeEnum } from '@/types';
import { useContactsStore } from '@/stores/ContactsStores/useContactsStore';

export const ContactsPage: FC = () => {
  const { setPageMode } = useContactsStore((state) => state);

  useEffect(
    () => {
      setPageMode(ContactsPageMode.default);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack gap={3} height={'100%'} overflow={'auto'} px={8} py={6}>
      <Stack gap={1.5}>
        <Typography variant={'h6'}>Contacts</Typography>
        <ContactsHeader headerType={ContactsTableTypeEnum.people} />
      </Stack>
      <GridContacts gridType={ContactsTableTypeEnum.people} />
    </Stack>
  );
};

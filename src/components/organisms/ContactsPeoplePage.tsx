import React, { FC, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import { GridContacts, HeaderFilter } from '@/components/molecules';

import { ContactsPageMode, ContactsTableTypeEnum } from '@/types';
import { useContactsStore } from '@/stores/ContactsStores/useContactsStore';

export const ContactsPeoplePage: FC = () => {
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
        <Typography variant={'h6'}>People</Typography>
        <HeaderFilter headerType={ContactsTableTypeEnum.people} />
      </Stack>
      <GridContacts gridType={ContactsTableTypeEnum.people} />
    </Stack>
  );
};

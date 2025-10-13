import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { DialogCompanyType } from './DialogCompanyType';

import ICON_ARROW from './assets/icon_arrow_left_right.svg';

import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';
import { useFindCompaniesStore } from '@/stores/useFindPeopleCompanyStore/useFindCompaniesStore';

type CompanyTypeFilterProps = {
  title: string;
};

export const CompanyTypeFilter: FC<CompanyTypeFilterProps> = ({ title }) => {
  const { setDialogSourceFromOpen } = useFindPeopleCompanyStore(
    (store) => store,
  );

  const { checkedSource } = useFindPeopleCompanyStore((store) => store);

  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={2} gap={1} p={1.5}>
      <Typography
        lineHeight={1.2}
        sx={{
          userSelect: 'none',
        }}
        variant={'subtitle2'}
      >
        {title}
      </Typography>
      <Stack
        alignItems={'center'}
        bgcolor={'#EFE9FB'}
        borderRadius={1}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={() => setDialogSourceFromOpen(true)}
        px={1.5}
        py={0.5}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant={'body2'}>{checkedSource.title}</Typography>
        <Icon component={ICON_ARROW} sx={{ width: 16, height: 16 }} />
      </Stack>
      <DialogCompanyType />
    </Stack>
  );
};

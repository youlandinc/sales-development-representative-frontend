import React from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { DialogCompanyType } from './DialogCompanyType';

import ICON_ARROW from './assets/icon_arrow_left_right.svg';

import { CompanyTypeEnum } from '@/types';
import { useFindCompaniesStore } from '@/stores/useFindCompiesStore';

export const CompanyTypeFilter = () => {
  const { filters, resetFilters, setDialogCompanyTypeOpen, setFilters } =
    useFindCompaniesStore((store) => store);

  const TYPE_NAME: Record<CompanyTypeEnum, string> = {
    [CompanyTypeEnum.customer]: 'Customers',
    [CompanyTypeEnum.venture_capital]: 'Venture Capital firms',
    [CompanyTypeEnum.limited_partners]: 'Limited Partners',
  };

  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={2} gap={1} p={1.5}>
      <Typography
        lineHeight={1.2}
        sx={{
          userSelect: 'none',
        }}
        variant={'subtitle2'}
      >
        Company type
      </Typography>
      <Stack
        alignItems={'center'}
        bgcolor={'#EFE9FB'}
        borderRadius={1}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={() => setDialogCompanyTypeOpen(true)}
        px={1.5}
        py={0.5}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant={'body2'}>
          {TYPE_NAME[filters.companyType as CompanyTypeEnum]}
        </Typography>
        <Icon component={ICON_ARROW} sx={{ width: 16, height: 16 }} />
      </Stack>
      <DialogCompanyType
        cb={(type) => {
          setFilters('companyType', type);
        }}
      />
    </Stack>
  );
};

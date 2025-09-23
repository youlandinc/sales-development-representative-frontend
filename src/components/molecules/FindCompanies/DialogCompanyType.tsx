import React, { ElementType, FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { CompanyTypeEnum } from '@/types';

import ICON_CLOSE from '@/components/molecules/FindCompanies/assets/icon_close.svg';
import ICON_RECEIPT from '@/components/molecules/FindCompanies/assets/icon_receipt.svg';
import ICON_CHART from '@/components/molecules/FindCompanies/assets/icon_chart.svg';
import ICON_COINS from '@/components/molecules/FindCompanies/assets/icon_coins.svg';
import { useFindCompaniesStore } from '@/stores/useFindCompiesStore';

type TypeCardProps = {
  title: string;
  icon: ElementType;
  desc: string;
  checked?: boolean;
  handleClick?: (type: CompanyTypeEnum) => void;
  value: CompanyTypeEnum;
};
const TypeCard: FC<TypeCardProps> = ({
  title,
  icon,
  desc,
  value,
  handleClick,
  checked,
}) => {
  return (
    <Stack
      bgcolor={'#F7F4FD'}
      borderRadius={4}
      gap={1.5}
      onClick={() => {
        handleClick?.(value);
      }}
      p={3}
      sx={{
        outline: '1px solid #DFDEE6',
        '&:hover': {
          bgcolor: '#EFE9FB',
        },
        cursor: 'pointer',
        bgcolor: checked ? '#EFE9FB' : '#fff',
        outlineWidth: checked ? '2px' : '1px',
        outlineColor: checked ? '#6E4EFB' : '#DFDEE6',
      }}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={icon} sx={{ width: 24, height: 24 }} />
        <Typography lineHeight={1.2} variant={'subtitle2'}>
          {title}
        </Typography>
      </Stack>
      <Typography variant={'body3'}>{desc}</Typography>
    </Stack>
  );
};

type DialogCompanyTypeProps = {
  cb?: (type: CompanyTypeEnum) => void;
};

export const DialogCompanyType: FC<DialogCompanyTypeProps> = ({ cb }) => {
  const {
    filters,
    dialogCompanyTypeOpen,
    setDialogCompanyTypeOpen,
    resetFilters,
  } = useFindCompaniesStore((store) => store);
  const [type, setType] = useState<CompanyTypeEnum>(
    filters.companyType as CompanyTypeEnum,
  );
  const CARD_LIST = [
    {
      value: CompanyTypeEnum.customer,
      title: 'Customers',
      icon: ICON_RECEIPT,
      desc: 'Discover potential customers and business leads. Access profiles, contact details, and insights to help you engage the right audience and grow your business.',
    },
    {
      value: CompanyTypeEnum.venture_capital,
      title: 'Venture Capital firms',
      icon: ICON_CHART,
      desc: 'Explore a curated database of venture capital firms. Quickly identify the right investors, understand their focus areas, and make more informed fundraising decisions.',
    },
    {
      value: CompanyTypeEnum.limited_partners,
      title: 'Limited Partners',
      icon: ICON_COINS,
      desc: 'Get comprehensive insights on limited partners — including profiles, assets under management, commitments, and investment strategies — all in one place.',
    },
  ];
  return (
    <StyledDialog
      content={
        <Stack flexDirection={'row'} gap={3} py={3}>
          {CARD_LIST.map((item, index) => (
            <TypeCard
              checked={type === item.value}
              desc={item.desc}
              handleClick={setType}
              icon={item.icon}
              key={index}
              title={item.title}
              value={item.value}
            />
          ))}
        </Stack>
      }
      footer={
        <StyledButton
          onClick={() => {
            setDialogCompanyTypeOpen(false);
            resetFilters();
            cb?.(type);
          }}
          size={'medium'}
        >
          Continue
        </StyledButton>
      }
      header={
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography color={'inherit'} fontSize={20} fontWeight={'inherit'}>
            What type of companies are you looking for?
          </Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={() => setDialogCompanyTypeOpen(false)}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={() => setDialogCompanyTypeOpen(false)}
      open={dialogCompanyTypeOpen}
      slotProps={{
        paper: {
          sx: {
            maxWidth: '1200px !important',
          },
        },
      }}
    />
  );
};

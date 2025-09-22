import React, { ElementType, FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';

import ICON_ARROW from './assets/icon_arrow_left_right.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import ICON_COINS from './assets/icon_coins.svg';
import ICON_RECEIPT from './assets/icon_receipt.svg';
import ICON_CHART from './assets/icon_chart.svg';

import { CompanyTypeEnum } from '@/types';
import { useSwitch } from '@/hooks';
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

export const CompanyTypeFilter = () => {
  const { filters, setFilters, resetFilters } = useFindCompaniesStore(
    (store) => store,
  );
  const { visible, toggle } = useSwitch();
  const [type, setType] = useState(filters.companyType);

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
        onClick={toggle}
        px={1.5}
        py={0.5}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant={'body2'}>
          {TYPE_NAME[filters.companyType as CompanyTypeEnum]}
        </Typography>
        <Icon component={ICON_ARROW} sx={{ width: 16, height: 16 }} />
      </Stack>
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
              setFilters('companyType', type);
              resetFilters();
              toggle();
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
              onClick={toggle}
              sx={{ width: 24, height: 24, cursor: 'pointer' }}
            />
          </Stack>
        }
        onClose={toggle}
        open={visible}
        slotProps={{
          paper: {
            sx: {
              maxWidth: '1200px !important',
            },
          },
        }}
      />
    </Stack>
  );
};

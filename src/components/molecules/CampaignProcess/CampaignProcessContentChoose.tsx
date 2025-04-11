import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { ProcessCreateTypeEnum } from '@/types';

import ICON_PRODUCT_FILTER from './assets/icon_product_filter.svg';
import ICON_PRODUCT_CSV from './assets/icon_product_csv.svg';
import ICON_PRODUCT_CRM from './assets/icon_product_crm.svg';
import ICON_PRODUCT_SAVED_LIST from './assets/icon_product_saved_list.svg';
import ICON_PRODUCT_AGENT from './assets/icon_product_agent.svg';
import useSWR from 'swr';

const DEFAULT_PRODUCT = [
  {
    label: 'Filter',
    content:
      'Use filters to target the people you want. Customize your search by function, job title, industry, seniority level, company size, location, and more.',
    icon: ICON_PRODUCT_FILTER,
    value: ProcessCreateTypeEnum.filter,
  },
  {
    label: 'Upload CSV',
    content:
      'Upload a CSV file containing your contacts. We’ll enrich the data and help you send highly personalized outreach.',
    icon: ICON_PRODUCT_CSV,
    value: ProcessCreateTypeEnum.csv,
  },
  {
    label: 'CRM List',
    content:
      'Link a CRM list, and we’ll automatically enrich their data (roles, industries, company details) to fuel hyper-targeted outreach.',
    icon: ICON_PRODUCT_CRM,
    value: ProcessCreateTypeEnum.crm,
  },
  {
    label: 'Saved List',
    content:
      "Select a pre-filtered list you've already created in the system. We'll enrich it with the latest data and power personalized outreach—no extra setup needed.",
    icon: ICON_PRODUCT_SAVED_LIST,
    value: ProcessCreateTypeEnum.saved_list,
  },
  {
    label: (
      <>
        Agent{' '}
        <b style={{ color: '#6E4EFB', fontSize: 12, fontWeight: 600 }}>beta</b>
      </>
    ),
    content:
      'Chat with an AI agent to define customer criteria. The agent automates filtering for targeted prospecting and data enrichment.',
    icon: ICON_PRODUCT_AGENT,
    value: ProcessCreateTypeEnum.agent,
  },
];

export const CampaignProcessContentChoose: FC = () => {
  const { setCampaignType, fetchProviderOptions, fetchSavedListOptions } =
    useDialogStore();

  useSWR(
    'fetchOptions',
    async () => {
      await Promise.allSettled([
        fetchProviderOptions(),
        fetchSavedListOptions(),
      ]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <Stack
      flexDirection={'row'}
      height={'100%'}
      justifyContent={'space-between'}
      my={3}
      px={1}
      width={'100%'}
    >
      {DEFAULT_PRODUCT.map((item, index) => (
        <Stack
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          gap={1}
          key={`${item.label}-${index}`}
          maxWidth={200}
          onClick={() => {
            setCampaignType(item.value);
          }}
          p={3}
          sx={{
            outline: '1px solid transparent',
            transition: 'all .3s',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#6E4EFB',
              outline: '1px solid #6E4EFB',
            },
          }}
        >
          <Stack flexDirection={'row'} gap={1}>
            <Icon component={item.icon} sx={{ width: 24, height: 24 }} />
            <Typography color={'text.primary'} variant={'subtitle2'}>
              {item.label}
            </Typography>
          </Stack>
          <Typography color={'text.primary'} variant={'body3'}>
            {item.content}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

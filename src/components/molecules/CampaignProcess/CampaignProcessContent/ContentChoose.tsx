import { FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { ProcessCreateTypeEnum } from '@/types';

import ICON_PRODUCT_SAVED_TABLE from '../assets/icon_product_saved_table.svg';
import ICON_PRODUCT_CSV from '../assets/icon_product_csv.svg';
import ICON_PRODUCT_CRM from '../assets/icon_product_crm.svg';

//import ICON_PRODUCT_AGENT from '../assets/icon_product_agent.svg';
//import ICON_PRODUCT_FILTER from '../assets/icon_product_filter.svg';
//import ICON_PRODUCT_SAVED_LIST from '../assets/icon_product_saved_list.svg';

import useSWR from 'swr';
import { StyledButton } from '@/components/atoms';

const DEFAULT_PRODUCT = [
  {
    label: 'Saved table',
    content:
      "Select a pre-filtered list you've already created in the system. We'll enrich it with the latest data and power personalized outreach—no extra setup needed.",
    icon: ICON_PRODUCT_SAVED_TABLE,
    value: ProcessCreateTypeEnum.ai_table,
  },
  {
    label: 'CRM list',
    content:
      'Link a CRM list, and we’ll automatically enrich their data (roles, industries, company details) to fuel hyper-targeted outreach.',
    icon: ICON_PRODUCT_CRM,
    value: ProcessCreateTypeEnum.crm,
  },

  {
    label: 'Upload CSV',
    content:
      'Upload a CSV file containing your contacts. We’ll enrich the data and help you send highly personalized outreach.',
    icon: ICON_PRODUCT_CSV,
    value: ProcessCreateTypeEnum.csv,
  },
  //{
  //  label: 'Filter',
  //  content:
  //    'Use filters to target the people you want. Customize your search by function, job title, industry, seniority level, company size, location, and more.',
  //  icon: ICON_PRODUCT_FILTER,
  //  value: ProcessCreateTypeEnum.filter,
  //},
  //{
  //  label: (
  //    <>
  //      Agent{' '}
  //      <b style={{ color: '#6E4EFB', fontSize: 12, fontWeight: 600 }}>beta</b>
  //    </>
  //  ),
  //  content:
  //    'Chat with an AI agent to define customer criteria. The agent automates filtering for targeted prospecting and data enrichment.',
  //  icon: ICON_PRODUCT_AGENT,
  //  value: ProcessCreateTypeEnum.agent,
  //},
];

export const ContentChoose: FC = () => {
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

  const [currentStep, setCurrentStep] = useState<ProcessCreateTypeEnum | ''>(
    '',
  );

  const onClickToAudience = () => {
    if (!currentStep) {
      return;
    }
    setCampaignType(currentStep);
  };

  return (
    <Stack gap={3} mb={3} width={'100%'}>
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        px={1}
        width={'100%'}
      >
        {DEFAULT_PRODUCT.map((item, index) => (
          <Stack
            border={'1px solid #DFDEE6'}
            borderRadius={4}
            className={currentStep === item.value ? 'active' : ''}
            gap={1}
            key={`${item.label}-${index}`}
            maxWidth={352}
            onClick={() => {
              setCurrentStep(item.value);
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
              '&.active': {
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
      <StyledButton
        disabled={!currentStep}
        onClick={() => onClickToAudience()}
        size={'medium'}
        sx={{ width: 84, ml: 'auto' }}
      >
        Continue
      </StyledButton>
    </Stack>
  );
};

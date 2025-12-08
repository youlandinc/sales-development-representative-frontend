'use client';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import {
  debounce,
  Icon,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { UFormatNumber, UFormatPercent } from '@/utils';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import { HttpError, ResponseCampaignStatistics } from '@/types';
import { _fetchCampaignStatistics } from '@/request';

import ICON_HEADER_SEARCH from './assets/icon_header_search.svg';

import ICON_LEADS_SOURCED from './assets/icon_leads_sourced.svg';
import ICON_ACTIVE_LEADS from './assets/icon_active_leads.svg';
import ICON_OPEN_RATE from './assets/icon_open_rate.svg';
import ICON_REPLY_RATE from './assets/icon_reply_rate.svg';
import ICON_MEETINGS_BOOKED from './assets/icon_meetings_booked.svg';
import ICON_PLUS from './assets/icon_plus.svg';

const mock = [
  {
    label: 'Leads sourced',
    icon: ICON_LEADS_SOURCED,
    value: 0,
    key: 'leadsSourced',
  },
  {
    label: 'Active leads',
    icon: ICON_ACTIVE_LEADS,
    value: 0,
    key: 'activeLeads',
  },
  {
    label: 'Open rate',
    icon: ICON_OPEN_RATE,
    value: 0,
    key: 'openRate',
  },
  {
    label: 'Reply rate',
    icon: ICON_REPLY_RATE,
    value: 0,
    key: 'replyRate',
  },
  {
    label: 'Meetings booked',
    icon: ICON_MEETINGS_BOOKED,
    value: 0,
    key: 'meetingsBooked',
  },
];

interface CampaignsHeaderProps {
  dispatch: any;
  store: { searchWord: string };
}

export const CampaignsHeader: FC<CampaignsHeaderProps> = ({
  store,
  dispatch,
}) => {
  const { openProcess, openProcessLoading } = useDialogStore();

  const [cardData, setCardData] = useState(mock);

  const { isLoading } = useSWR(
    'campaigns',
    async () => {
      try {
        const { data } = await _fetchCampaignStatistics();

        setCardData((prev) =>
          prev.map((item) => ({
            ...item,
            value: data[item.key as keyof ResponseCampaignStatistics],
          })),
        );
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const [value, setValue] = useState(store.searchWord);

  const debounceSearchWord = useMemo(
    () =>
      debounce((value) => {
        dispatch({ type: 'change', payload: { field: 'searchWord', value } });
      }, 500),
    [dispatch],
  );

  //const debounceSearchWord = debounce((value)=>dispatch({ type: 'change', payload: { field: 'searchWord', value } }), 500);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounceSearchWord(e.target.value);
  };

  return (
    <Stack gap={3}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Typography variant={'h5'}>Campaigns</Typography>

        <Stack flexDirection={'row'} gap={3} ml={'auto'}>
          <StyledTextField
            onChange={onChange}
            size={'small'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment
                    position={'start'}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      component={ICON_HEADER_SEARCH}
                      sx={{ width: 16, height: 16 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            value={value}
          />
          <StyledButton
            disabled={openProcessLoading}
            loading={openProcessLoading}
            onClick={() => openProcess()}
            size={'small'}
            sx={{ width: 190 }}
          >
            <Icon
              component={ICON_PLUS}
              sx={{ width: 12, height: 12, mr: 0.5 }}
            />
            <Typography variant={'subtitle2'}>Create new campaign</Typography>
          </StyledButton>
        </Stack>
      </Stack>

      {/* <Stack flexDirection={'row'} gap={3}>
        {cardData.map((item, index) => (
          <Stack
            border={'1px solid #DFDEE6'}
            borderRadius={2}
            flex={1}
            gap={1.5}
            key={index}
            p={3}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <Icon component={item.icon} />
              <Typography pb={0.25} variant={'subtitle1'}>
                {item.label}
              </Typography>
            </Stack>

            {isLoading ? (
              <Skeleton height={48} width={56} />
            ) : (
              <Typography variant={'h4'}>
                {item.key === 'openRate' || item.key === 'replyRate'
                  ? UFormatPercent(item.value)
                  : UFormatNumber(item.value)}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack> */}
    </Stack>
  );
};

import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';
import { UFormatNumber } from '@/utils';

import { SDRToast, StyledLoading } from '@/components/atoms';
import { CampaignLeadsCard } from '@/components/molecules';

import { HttpError, ProcessCreateTypeEnum } from '@/types';
import { _fetchChatLeads } from '@/request';

export const CampaignProcessContentAudience = () => {
  const {
    chatId,
    isFirst,
    returning,
    setLeadsList,
    setLeadsCount,
    setLeadsVisible,
    campaignType,
    leadsFetchLoading,
    leadsCount,
    leadsList,
    leadsVisible,
  } = useDialogStore();

  const [leadsFetching, setLeadsFetching] = useState(false);

  const fetchLeads = async () => {
    !leadsVisible && setLeadsVisible(true);
    setLeadsFetching(true);
    try {
      const {
        data: { leads, counts },
      } = await _fetchChatLeads(chatId);
      setLeadsList(leads);
      setLeadsCount(counts);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLeadsFetching(false);
    }
  };

  useEffect(
    () => {
      if (campaignType === ProcessCreateTypeEnum.agent) {
        if (isFirst) {
          return;
        }
        if (!returning) {
          fetchLeads();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFirst, returning, campaignType],
  );
  return campaignType === ProcessCreateTypeEnum.agent ? (
    <Stack
      alignItems={leadsFetching ? 'center' : 'unset'}
      border={'1px solid #DFDEE6'}
      borderRadius={4}
      flexShrink={0}
      height={'100%'}
      justifyContent={leadsFetching ? 'center' : 'unset'}
      overflow={'auto'}
      px={leadsVisible ? 3 : 0}
      sx={{
        transition: 'all .3s',
        visibility: leadsVisible ? 'visible' : 'hidden',
      }}
      width={leadsVisible ? 360 : 0}
    >
      {leadsFetching ? (
        <StyledLoading size={48} />
      ) : (
        <>
          <Stack
            bgcolor={'#ffffff'}
            borderBottom={'1px solid #DFDEE6'}
            flexDirection={'row'}
            pb={1.5}
            position={'sticky'}
            pt={3}
            sx={{
              zIndex: 999,
            }}
            top={0}
          >
            <Typography variant={'subtitle1'}>Preview leads</Typography>
            <Typography color={'text.secondary'} ml={'auto'} variant={'body2'}>
              Estimated <b>{UFormatNumber(leadsCount)}</b> leads
            </Typography>
          </Stack>

          <Stack pb={3}>
            {leadsList.map((lead, index) => (
              <CampaignLeadsCard
                key={`${lead.firstName}-${lead.lastName}-${index}`}
                {...lead}
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  ) : (
    <Stack
      alignItems={leadsFetchLoading ? 'center' : 'unset'}
      border={'1px solid #DFDEE6'}
      borderRadius={4}
      flexShrink={0}
      height={'calc(100% - 24px)'}
      justifyContent={leadsFetchLoading ? 'center' : 'unset'}
      mt={3}
      overflow={'auto'}
      position={'sticky'}
      px={leadsVisible ? 3 : 0}
      sx={{
        transition: 'all .3s',
        visibility: leadsVisible ? 'visible' : 'hidden',
      }}
      width={leadsVisible ? 360 : 0}
    >
      {leadsFetchLoading ? (
        <StyledLoading size={48} />
      ) : (
        <>
          <Stack
            bgcolor={'#ffffff'}
            borderBottom={'1px solid #DFDEE6'}
            flexDirection={'row'}
            pb={1.5}
            position={'sticky'}
            pt={3}
            sx={{
              zIndex: 999,
            }}
            top={0}
          >
            <Typography variant={'subtitle1'}>Preview leads</Typography>
            <Typography color={'text.secondary'} ml={'auto'} variant={'body2'}>
              Estimated <b>{UFormatNumber(leadsCount)}</b> leads
            </Typography>
          </Stack>

          <Stack
            alignItems={leadsList.length > 0 ? 'unset' : 'center'}
            flex={1}
            justifyContent={leadsList.length > 0 ? 'unset' : 'center'}
            pb={3}
            width={'100%'}
          >
            {leadsList.length > 0 ? (
              leadsList.map((lead, index) => (
                <CampaignLeadsCard
                  key={`${lead.firstName}-${lead.lastName}-${index}`}
                  {...lead}
                />
              ))
            ) : (
              <Typography color={'text.secondary'} variant={'body2'}>
                No matching leads found.
              </Typography>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

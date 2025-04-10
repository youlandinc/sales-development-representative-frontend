import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';
import { UFormatNumber } from '@/utils';

import { useDebounce } from '@/hooks';

import { SDRToast, StyledLoading } from '@/components/atoms';
import { CampaignLeadsCard } from '@/components/molecules';

import { HttpError, ProcessCreateTypeEnum } from '@/types';
import { _fetchChatLeads, _fetchFilterLeads } from '@/request';

export const CampaignProcessContentAudience: FC = () => {
  const {
    campaignType,
    isFirst,
    // agent
    chatId,
    returning,
    // filter
    filterFormData,

    leadsFetchLoading,
    leadsList,
    leadsCount,
    leadsVisible,

    setIsFirst,
    setLeadsList,
    setLeadsCount,
    setLeadsVisible,
    setLeadsFetchLoading,
  } = useDialogStore();

  const debouncedFormData = useDebounce(filterFormData, 500);

  const { isLoading } = useSWR(
    campaignType === ProcessCreateTypeEnum.agent
      ? {
          returning,
          isFirst,
        }
      : campaignType === ProcessCreateTypeEnum.filter
        ? debouncedFormData
        : null,
    async (data: any) => {
      switch (campaignType) {
        case ProcessCreateTypeEnum.agent:
          if (isFirst || data.returning) {
            return;
          }
          setLeadsFetchLoading(true);
          setLeadsVisible(true);
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
            setLeadsFetchLoading(false);
          }
          break;
        case ProcessCreateTypeEnum.filter:
          if (isFirst) {
            return setIsFirst(false);
          }
          if (!leadsVisible) {
            setLeadsVisible(true);
          }
          setLeadsFetchLoading(true);
          try {
            const {
              data: { counts, leads },
            } = await _fetchFilterLeads(debouncedFormData);
            setLeadsList(leads);
            setLeadsCount(counts);
          } catch (err) {
            const { message, header, variant } = err as HttpError;
            SDRToast({ message, header, variant });
          } finally {
            setLeadsFetchLoading(false);
          }
          break;
        case ProcessCreateTypeEnum.crm:
        case ProcessCreateTypeEnum.csv:
          return null;
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  return !isFirst ? (
    <Stack
      alignItems={isLoading || leadsFetchLoading ? 'center' : 'unset'}
      border={'1px solid #DFDEE6'}
      borderRadius={4}
      flexShrink={0}
      height={'100%'}
      justifyContent={isLoading || leadsFetchLoading ? 'center' : 'unset'}
      overflow={'auto'}
      px={leadsVisible ? 3 : 0}
      sx={{
        transition: 'all .3s',
        visibility: leadsVisible ? 'visible' : 'hidden',
      }}
      width={leadsVisible ? 360 : 0}
    >
      {isLoading || leadsFetchLoading ? (
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
            top={0}
            zIndex={999}
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
  ) : null;
};

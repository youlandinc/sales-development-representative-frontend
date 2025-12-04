import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  CampaignsPendingBaseInfo,
  CampaignsPendingEmails,
  CampaignsPendingHeader,
  CampaignsPendingPerformance,
  CampaignsPendingTimeline,
} from '@/components/molecules';

import {
  CampaignStatusEnum,
  HttpError,
  ICampaignsPendingBaseInfo,
  ICampaignsPendingPerformance,
  ICampaignsPendingTimeline,
} from '@/types';
import { _fetchCampaignPendingInfo } from '@/request';
import { useAsyncFn } from '@/hooks';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

export const CampaignsPending = () => {
  const { campaignId } = useParams();
  const { setLoading, setIsNoData, setTotalEmails } = usePendingApprovalStore(
    (state) => state,
  );

  const [activeBtn, setActiveBtn] = useState<'email' | 'performance'>('email');
  const [baseInfo, setBaseInfo] = useState<ICampaignsPendingBaseInfo>({
    sentOn: new Date().toISOString(),
    replyTo: '',
    sender: '',
  });
  const [campaignName, setCampaignName] = useState('');
  const [campaignStatus, setCampaignStatus] = useState(
    CampaignStatusEnum.active,
  );
  const [timeline, setTimeline] = useState<ICampaignsPendingTimeline[]>([]);
  const [performances, setPerformances] =
    useState<ICampaignsPendingPerformance>();

  const [baseDataState, fetchBaseData] = useAsyncFn(async () => {
    try {
      const { data } = await _fetchCampaignPendingInfo(
        parseInt(campaignId as string),
      );
      setBaseInfo({
        sentOn: data.data.sentOn || new Date().toISOString(),
        sender: data.data.sender || '',
        replyTo: data.data.replyTo || '',
      });
      setCampaignName(data.campaignName);
      setCampaignStatus(data.campaignStatus);
      setTimeline(data.data.timeLine);
      setPerformances(data.data.performance);
      if (
        data.data.autopilot === true ||
        data.campaignStatus === CampaignStatusEnum.done
      ) {
        setActiveBtn('performance');
      }
      return data;
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    if (campaignId) {
      setLoading(true);
      setIsNoData(false);
      setTotalEmails(0);
      // noinspection JSIgnoredPromiseFromCall
      fetchBaseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  /*  useEffect(() => {
    if (campaignId) {
      // noinspection JSIgnoredPromiseFromCall
      activeBtn === 'email' &&
        fetchPendingEmailsData(parseInt(campaignId as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, activeBtn]);*/

  return (
    <Stack height={'100vh'}>
      <CampaignsPendingHeader
        campaignId={parseInt(campaignId as string)}
        campaignName={campaignName}
        campaignStatus={campaignStatus}
        cb={fetchBaseData}
        loading={baseDataState.loading}
      />
      <Stack
        flex={1}
        flexDirection={'row'}
        gap={3}
        overflow={'auto'}
        pb={6}
        pl={6}
        pt={3}
      >
        <Stack gap={3} height={'fit-content'} width={400}>
          <CampaignsPendingBaseInfo {...baseInfo} />
          <CampaignsPendingTimeline
            campaignName={campaignName}
            timeline={timeline}
          />
        </Stack>
        <Stack flex={1} gap={3} overflow={'auto'}>
          <Stack
            flexDirection={'row'}
            gap={1}
            sx={{
              '& .active': {
                borderColor: 'primary.hover',
              },
            }}
          >
            {!(
              baseDataState.value?.data?.autopilot === true ||
              baseDataState.value?.campaignStatus === CampaignStatusEnum.done ||
              baseDataState.loading
            ) && (
              <StyledButton
                className={activeBtn === 'email' ? 'active' : ''}
                color={'info'}
                onClick={() => setActiveBtn('email')}
                size={'medium'}
                sx={{ px: '12px !important', py: '8px !important' }}
                variant={'outlined'}
              >
                Pending emails
              </StyledButton>
            )}
            {!baseDataState.loading && (
              <StyledButton
                className={activeBtn === 'performance' ? 'active' : ''}
                color={'info'}
                onClick={() => setActiveBtn('performance')}
                size={'medium'}
                sx={{ px: '12px !important', py: '8px !important' }}
                variant={'outlined'}
              >
                Performance
              </StyledButton>
            )}
          </Stack>
          {!baseDataState.loading && baseDataState.value && (
            <>
              {activeBtn === 'email' && (
                <CampaignsPendingEmails
                  showStepNumber={baseDataState.value?.data?.hasManySteps}
                />
              )}
              {activeBtn === 'performance' && (
                <CampaignsPendingPerformance performances={performances} />
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

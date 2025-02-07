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

export const CampaignsPending = () => {
  const { campaignId } = useParams();

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

  const fetData = async () => {
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
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  useEffect(() => {
    if (campaignId) {
      // noinspection JSIgnoredPromiseFromCall
      fetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return (
    <Stack height={'100vh'}>
      <CampaignsPendingHeader
        campaignId={parseInt(campaignId as string)}
        campaignName={campaignName}
        campaignStatus={campaignStatus}
      />
      <Stack flexDirection={'row'} gap={3} pb={6} pt={3} px={6}>
        <Stack gap={3} height={'fit-content'} width={400}>
          <CampaignsPendingBaseInfo {...baseInfo} />
          <CampaignsPendingTimeline
            campaignName={campaignName}
            timeline={timeline}
          />
        </Stack>
        <Stack flex={1} gap={3}>
          <Stack
            flexDirection={'row'}
            gap={1}
            sx={{
              '& .active': {
                bgcolor: '#F7F4FD !important',
                color: '#6E4EFB !important',
                borderColor: '#6E4EFB !important',
              },
            }}
          >
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
          </Stack>

          {activeBtn === 'email' && <CampaignsPendingEmails />}
          {activeBtn === 'performance' && (
            <CampaignsPendingPerformance performances={performances} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

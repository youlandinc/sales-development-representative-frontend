import { useEffect, useState } from 'react';
import { Box, Fade, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  CampaignsPendingBaseInfo,
  CampaignsPendingEmails,
  CampaignsPendingHeader,
  CampaignsPendingPerformance,
  CampaignsPendingTimeline,
} from '@/components/molecules';

import { CampaignsPendingTimeLineEnum } from '@/types/enum';
import {
  CampaignStatusEnum,
  HttpError,
  ICampaignsPendingBaseInfo,
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
    <Stack height={'100%'}>
      <CampaignsPendingHeader
        campaignName={campaignName}
        campaignStatus={campaignStatus}
      />
      <Stack flexDirection={'row'} gap={3} pb={6} pt={3} px={6}>
        <Stack gap={3} height={'fit-content'} width={400}>
          <CampaignsPendingBaseInfo {...baseInfo} />
          <CampaignsPendingTimeline
            campaignName={'yeah'}
            timeline={[
              {
                total: 9,
                sent: 9,
                unSent: 0,
                status: CampaignsPendingTimeLineEnum.completed,
                startTime: '2024-12-20T00:40:36.281516Z',
                endTime: '2024-12-20T00:40:59.714739Z',
                dayDone: null,
                quantity: null,
              },
              {
                total: null,
                sent: null,
                unSent: null,
                status: CampaignsPendingTimeLineEnum.scheduled,
                startTime: '2024-12-20T00:40:36.192890Z',
                endTime: '2024-12-20T00:40:36.192890Z',
                dayDone: 1,
                quantity: 9,
              },
            ]}
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
          {activeBtn === 'email' && (
            <Fade in>
              <Box>
                <CampaignsPendingEmails />
              </Box>
            </Fade>
          )}
          {activeBtn === 'performance' && (
            <Fade in={activeBtn === 'performance'}>
              <Box>
                <CampaignsPendingPerformance />
              </Box>
            </Fade>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

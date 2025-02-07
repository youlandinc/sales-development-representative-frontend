import { useEffect } from 'react';
import { Box, Fade, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { SDRToast } from '@/components/atoms';
import { CampaignsPendingEmailsCard } from '@/components/molecules';

import { _fetCampaignPendingEmails } from '@/request';
import { HttpError } from '@/types';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';
import useAsyncFn from '@/hooks/useAsyncFn';

export const CampaignsPendingEmails = () => {
  const { campaignId } = useParams<{ campaignId?: string }>();

  const { pendingEmails, setPendingEmails } = usePendingApprovalStore(
    (state) => state,
  );

  const [state, fetchData] = useAsyncFn(async () => {
    try {
      const { data } = await _fetCampaignPendingEmails(
        parseInt(campaignId as string),
        100,
        0,
      );
      setPendingEmails(data.content);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [campaignId]);

  /*  const fetchData = async () => {
    try {
      const { data } = await _fetCampaignPendingEmails(
        parseInt(campaignId as string),
        100,
        0,
      );
      setPendingEmails(data.content);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };*/

  useEffect(() => {
    if (campaignId?.trim() !== '') {
      // noinspection JSIgnoredPromiseFromCall
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return (
    <Fade in={true}>
      <Stack gap={3}>
        <Typography variant={'subtitle2'}>
          Pending Emails ({pendingEmails.length})
        </Typography>
        <Stack gap={3}>
          {state.loading ? (
            <Box
              sx={{
                '& .MuiSkeleton-root': { height: 18 },
                bgcolor: 'background.white',
              }}
            >
              <Skeleton width={'50%'} />
              <Skeleton />
              <Skeleton />
            </Box>
          ) : (
            pendingEmails.map((item, index) => (
              <CampaignsPendingEmailsCard
                avatarName={'R'}
                avatarUrl={item.avatar || undefined}
                email={item.email}
                emailContent={item.content || ''}
                emailId={item.emailId}
                key={index}
                subject={item.subject || ''}
                time={item.sentOn}
              />
            ))
          )}
        </Stack>
      </Stack>
    </Fade>
  );
};

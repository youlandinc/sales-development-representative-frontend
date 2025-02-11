import { FC, useEffect } from 'react';
import { Box, Fade, Icon, Skeleton, Stack, Typography } from '@mui/material';

import { CampaignsPendingEmailsCard } from '@/components/molecules';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

import ICON_NO_DATA from './assets/icon_no_emails.svg';
import { useParams } from 'next/navigation';

type CampaignsPendingEmailsProps = {
  loading?: boolean;
  showStepNumber?: boolean;
};
export const CampaignsPendingEmails: FC<CampaignsPendingEmailsProps> = ({
  showStepNumber,
}) => {
  const { campaignId } = useParams();
  const {
    pendingEmails,
    isNoData,
    totalEmails,
    loading,
    fetchPendingEmailsData,
  } = usePendingApprovalStore((state) => state);

  useEffect(() => {
    if (campaignId) {
      // noinspection JSIgnoredPromiseFromCall

      fetchPendingEmailsData(parseInt(campaignId as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return (
    <Fade in={true}>
      {isNoData ? (
        <Stack alignItems={'center'} flex={1} gap={3} justifyContent={'center'}>
          <Icon component={ICON_NO_DATA} sx={{ width: 178, height: 160 }} />
          <Typography variant={'body2'}>No emails need approval.</Typography>
        </Stack>
      ) : (
        <Stack gap={3}>
          <Typography variant={'subtitle2'}>
            Pending Emails ({loading ? 0 : totalEmails})
          </Typography>
          <Stack gap={3}>
            {loading ? (
              <Box
                sx={{
                  '& .MuiSkeleton-root': { height: 18 },
                  bgcolor: 'background.white',
                }}
              >
                <Skeleton width={'50%'} />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Box>
            ) : (
              pendingEmails.map((item, index) => (
                <CampaignsPendingEmailsCard
                  avatarName={[
                    item.name?.split(' ')?.[0]?.[0]?.toLocaleUpperCase(),
                    item.name?.split(' ')?.[1]?.[1]?.toLocaleUpperCase(),
                  ].join('')}
                  avatarUrl={item.avatar || undefined}
                  email={item.email}
                  emailContent={item.content || ''}
                  emailId={item.emailId}
                  key={index}
                  showStepNumber={showStepNumber}
                  stepNumber={item.stepSequence}
                  subject={item.subject || ''}
                  time={item.sentOn}
                />
              ))
            )}
          </Stack>
        </Stack>
      )}
    </Fade>
  );
};

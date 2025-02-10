import { FC } from 'react';
import { Box, Fade, Icon, Skeleton, Stack, Typography } from '@mui/material';

import { CampaignsPendingEmailsCard } from '@/components/molecules';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

import ICON_NO_DATA from './assets/icon_no_emails.svg';

type CampaignsPendingEmailsProps = {
  loading?: boolean;
};
export const CampaignsPendingEmails: FC<CampaignsPendingEmailsProps> = ({
  loading,
}) => {
  const { pendingEmails, isNoData } = usePendingApprovalStore((state) => state);

  /* const [state, fetchData] = useAsyncFn(async () => {
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

  useEffect(() => {
    if (campaignId?.trim() !== '') {
      // noinspection JSIgnoredPromiseFromCall
      fetchData();
    }
  }, [campaignId]);*/

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
            Pending Emails ({pendingEmails.length})
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
      )}
    </Fade>
  );
};

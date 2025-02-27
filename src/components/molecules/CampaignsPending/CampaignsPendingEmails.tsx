import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Box, Fade, Icon, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { CampaignsPendingEmailsCard } from '@/components/molecules';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

import ICON_NO_DATA from './assets/icon_no_emails.svg';

type CampaignsPendingEmailsProps = {
  loading?: boolean;
  showStepNumber?: boolean;
};
export const CampaignsPendingEmails: FC<CampaignsPendingEmailsProps> = ({
  showStepNumber,
}) => {
  const { campaignId } = useParams();

  const [isScrolling, setIsScrolling] = useState(false);

  const {
    pendingEmails,
    isNoData,
    totalEmails,
    loading,
    fetchPendingEmailsData,
    setPendingEmails,
    pageSize,
    pageNumber,
  } = usePendingApprovalStore((state) => state);

  const handleScroll = async (e: SyntheticEvent<HTMLDivElement>) => {
    setIsScrolling(true);
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // console.log(scrollHeight, scrollTop, clientHeight);
    if (
      scrollHeight - scrollTop < clientHeight + 300 &&
      !loading &&
      pendingEmails.length < totalEmails
    ) {
      const res = await fetchPendingEmailsData(
        parseInt(campaignId as string),
        pageSize,
        pageNumber + 1,
      );
      setPendingEmails(pendingEmails.concat(res?.content || []));
    }
  };

  useEffect(() => {
    if (campaignId) {
      // noinspection JSIgnoredPromiseFromCall
      fetchPendingEmailsData(parseInt(campaignId as string), pageSize, 0);
    }
  }, [campaignId]);

  return (
    <Fade in={true}>
      {isNoData ? (
        <Stack alignItems={'center'} flex={1} gap={3} justifyContent={'center'}>
          <Icon component={ICON_NO_DATA} sx={{ width: 178, height: 160 }} />
          <Typography variant={'body2'}>No emails need approval.</Typography>
        </Stack>
      ) : (
        <Stack flex={1} gap={3} overflow={'auto'}>
          <Typography variant={'subtitle2'}>
            Pending Emails ({totalEmails})
          </Typography>
          <Stack
            flex={1}
            gap={3}
            onScroll={handleScroll}
            overflow={'auto'}
            pr={3}
          >
            {loading && !isScrolling ? (
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
                  leadId={item.leadId}
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

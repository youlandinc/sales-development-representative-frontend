import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { SDRToast } from '@/components/atoms';
import { CampaignsPendingEmailsCard } from '@/components/molecules';

import { _fetCampaignPendingEmails } from '@/request';
import { HttpError, ICampaignsPendingEmailsItem } from '@/types';

export const CampaignsPendingEmails = () => {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [pendingEmailInfo, setPendingEmailInfo] = useState<
    ICampaignsPendingEmailsItem[]
  >([
    {
      emailId: 0,
      sentOn: '',
      email: '',
      avatar: '',
      subject: '',
      content: '',
    },
  ]);

  const fetchData = async () => {
    try {
      const { data } = await _fetCampaignPendingEmails(
        parseInt(campaignId as string),
        100,
        0,
      );
      setPendingEmailInfo(data.content);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  useEffect(() => {
    if (campaignId?.trim() !== '') {
      // noinspection JSIgnoredPromiseFromCall
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return (
    <Stack gap={3}>
      <Typography variant={'subtitle2'}>
        Pending Emails ({pendingEmailInfo.length})
      </Typography>
      <Stack gap={3}>
        {pendingEmailInfo.map((item, index) => (
          <CampaignsPendingEmailsCard
            avatarName={'R'}
            email={item.email}
            emailContent={
              '<p><span style="font-size:12px"><strong>Elementum varius nisi vel tempus. Donec eleifend egestas viverra.</strong></span></p>' +
              '<p>&nbsp;</p>' +
              `<p><span style="font-size:12px">${item.content}</span></p>`
            }
            key={index}
            time={item.sentOn}
          />
        ))}
      </Stack>
    </Stack>
  );
};

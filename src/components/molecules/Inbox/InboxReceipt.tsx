import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import {
  CommonReceiptCardHeader,
  InboxReceiptCard,
} from '@/components/molecules';
import { useInboxStore } from '@/stores/useInboxStore';

export const InboxReceipt = () => {
  const { inboxContentList, selectedEmail, fetchEmailLoading } = useInboxStore(
    (state) => state,
  );

  return (
    <Stack flex={1}>
      {fetchEmailLoading ? (
        <Box height={81}>
          <Skeleton width={'50%'} />
          <Skeleton />
          <Skeleton />
        </Box>
      ) : (
        <CommonReceiptCardHeader
          avatarBgcolor={'background.avatar_defaultBg'}
          avatarName={selectedEmail?.name?.[0]?.toUpperCase()}
          avatarSx={{ height: 40, width: 40, fontSize: 20 }}
          email={
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'subtitle2'}>
                {selectedEmail?.name}
              </Typography>
              <Typography color={'#637381'} variant={'subtitle3'}>
                {typeof selectedEmail?.email === 'string'
                  ? `<${selectedEmail?.email}>`
                  : ''}
              </Typography>
            </Stack>
          }
          emailSx={{ gap: 2 }}
          sx={{
            px: 2,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'rgba(145, 158, 171, 0.24)',
          }}
          time={
            typeof selectedEmail?.sentOn === 'string'
              ? format(new Date(selectedEmail?.sentOn), 'LLL d, hh:mm a')
              : ''
          }
        />
      )}
      <Stack gap={2} p={4}>
        {inboxContentList.map((inboxContent, index) => (
          <InboxReceiptCard
            avatarName={inboxContent?.name?.[0]?.toUpperCase()}
            email={inboxContent.email || ''}
            emailContent={
              `<p><span style="font-size:12px"><strong>${inboxContent.subject}</strong></span></p>` +
              '<p>&nbsp;</p>' +
              `<p><span style="font-size:12px">${inboxContent.content}</span></p>`
            }
            emailType={inboxContent.emailType}
            key={index}
          />
        ))}
      </Stack>
    </Stack>
  );
};

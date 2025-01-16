import { Avatar, CardHeader, Stack, Typography } from '@mui/material';
import { InboxReceiptCard } from '@/components/molecules';

export const InboxReceipt = () => {
  return (
    <Stack flex={1} gap={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red', height: 40, width: 40 }}>R</Avatar>
        }
        // subheader={
        //   <Typography component={'span'} variant={'subtitle3'}>
        //     To: demo@minimal.kit
        //   </Typography>
        // }
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'rgba(145, 158, 171, 0.24)',
        }}
        title={
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Typography variant={'subtitle2'}>Shawn Manning</Typography>
            <Typography color={'#637381'} variant={'subtitle3'}>
              {'<'}Shawnmanning@gmail.com{'>'}
            </Typography>
          </Stack>
        }
      />
      <Stack gap={2} p={4}>
        <InboxReceiptCard />
        <InboxReceiptCard />
        <InboxReceiptCard />
      </Stack>
    </Stack>
  );
};

import { FC, SyntheticEvent, useState } from 'react';
import {
  Avatar,
  Box,
  CardHeader,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { StyledTextField } from '@/components/atoms';

export const InboxSide: FC = () => {
  const [value, setValue] = useState('Engaged');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack borderRight={'1px solid #E5E5E5'} width={320}>
      <Stack gap={3} p={2.5}>
        <Tabs
          aria-label="wrapped label tabs example"
          onChange={handleChange}
          sx={{
            minHeight: 'auto',
            '& .MuiTab-root': {
              p: 0,
              width: '50%',
              minHeight: 'auto',
              height: 'fit-content',
              pb: 1.5,
              textTransform: 'none',
              color: '#6F6C7D',
              fontSize: 12,
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#2A292E',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#2A292E',
            },
          }}
          value={value}
        >
          <Tab label={'Engaged'} value={'Engaged'} />
          <Tab label={'Sent'} value={'Sent'} />
        </Tabs>
        <StyledTextField placeholder={'Search contacts...'} />
      </Stack>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red', height: 32, width: 32 }}>R</Avatar>
        }
        subheader={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography
              component={'div'}
              maxWidth={210}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              variant={'subtitle2'}
            >
              You: How To Boost Boost Boost Boost Boost
            </Typography>
            <Box
              bgcolor={'#6E4EFB'}
              borderRadius={'10px'}
              height={10}
              width={10}
            ></Box>
          </Stack>
        }
        sx={{
          px: 2.5,
          py: 1.5,
          '&:hover': {
            bgcolor: '#F8F8FA',
          },
        }}
        title={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'subtitle2'}>Hey, how are you?</Typography>
            <Typography variant={'subtitle3'}>3 days</Typography>
          </Stack>
        }
      />
    </Stack>
  );
};

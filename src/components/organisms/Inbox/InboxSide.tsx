import { FC, SyntheticEvent, useState } from 'react';
import {
  Avatar,
  Box,
  CardHeader,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { StyledTextField } from '@/components/atoms';

import MoreVertIcon from '@mui/icons-material/MoreVert';

export const InboxSide: FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack width={300}>
      <Stack gap={3}>
        <Stack
          flexDirection={'row'}
          fontSize={12}
          fontWeight={600}
          gap={2}
          lineHeight={1.5}
          p={2.5}
          width={'100%'}
        >
          <Box
            borderBottom={'2px solid'}
            borderColor={'text.primary'}
            flex={1}
            pb={1.5}
            textAlign={'center'}
          >
            Engaged
          </Box>
          <Box
            borderBottom={'2px solid'}
            borderColor={'text.primary'}
            flex={1}
            pb={1.5}
            textAlign={'center'}
          >
            Sent
          </Box>
        </Stack>
        <StyledTextField placeholder={'Search contacts...'} />
      </Stack>
      <Stack flexDirection={'row'} gap={2}></Stack>
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
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              variant={'subtitle2'}
              width={'calc(100% - 100px)'}
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

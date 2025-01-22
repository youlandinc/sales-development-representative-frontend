import { useState } from 'react';
import { Icon, Stack } from '@mui/material';

import {
  CampaignsStatusBadge,
  CommonRenameTextField,
} from '@/components/molecules';
import { StyledButton } from '@/components/atoms';

import { CampaignStatusEnum } from '@/types';

import ICON_ARROW from './assets/icon_arrow.svg';
import { useRouter } from 'nextjs-toploader/app';

export const CampaignsPendingHeader = () => {
  const router = useRouter();
  const [title, setTitle] = useState('Untitled campaign');

  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      pb={1.5}
      pt={4}
      px={6}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={3} lineHeight={0}>
        <Stack
          height={'100%'}
          justifyContent={'center'}
          onClick={() => {
            router.push('/campaigns');
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Icon component={ICON_ARROW} sx={{ width: 20, height: 20 }} />
        </Stack>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <CommonRenameTextField
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              input: {
                onBlur: (e) => {
                  if (e.target.value === '') {
                    setTitle('Untitled campaign');
                  }
                },
              },
            }}
            value={title}
          />
          <CampaignsStatusBadge
            status={CampaignStatusEnum.draft}
            sx={{ py: 0.5 }}
          />
        </Stack>
      </Stack>
      <Stack flexDirection={'row'} gap={3}>
        <StyledButton color={'error'} variant={'outlined'}>
          Suspend
        </StyledButton>
        <StyledButton>Approve all</StyledButton>
      </Stack>
    </Stack>
  );
};

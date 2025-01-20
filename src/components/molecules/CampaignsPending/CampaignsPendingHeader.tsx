import { Icon, Stack, Typography } from '@mui/material';

import ICON_ARROW from './assets/icon_arrow.svg';
import { CampaignsStatusBadge } from '@/components/molecules';
import { CampaignStatusEnum } from '@/types';
import { StyledButton, StyledTextField } from '@/components/atoms';

export const CampaignsPendingHeader = () => {
  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      pb={1.5}
      pt={4}
      px={6}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={3}
        sx={{ cursor: 'pointer' }}
      >
        <Icon component={ICON_ARROW} sx={{ width: 20, height: 20 }} />
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <Typography variant={'h6'}>Untitled campaign</Typography>
          <StyledTextField />
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

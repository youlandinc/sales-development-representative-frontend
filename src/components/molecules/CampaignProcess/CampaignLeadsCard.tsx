import { FC } from 'react';
import { Avatar, Icon, Stack, Typography } from '@mui/material';

import { CampaignLeadItem } from '@/types';

import { StyledTooltip } from '@/components/atoms';

import ICON_LINKEDIN from './assets/icon_linkedin.svg';

export const CampaignLeadsCard: FC<CampaignLeadItem> = ({
  name,
  firstName,
  lastName,
  role,
  company,
  backgroundColor,
}) => {
  const avatarName = () => {
    const target = (firstName?.[0] ?? '') + (lastName?.[0] ?? '') || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  };

  return (
    <Stack
      borderBottom={'1px solid #E5E5E5'}
      flexDirection={'row'}
      gap={1}
      py={1.5}
    >
      <Avatar
        sx={{
          bgcolor: backgroundColor || '#dedede',
          width: 32,
          height: 32,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {avatarName()}
      </Avatar>
      <Stack width={'60%'}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <Typography variant={'subtitle2'}>{name}</Typography>
          <Icon component={ICON_LINKEDIN} sx={{ width: 18, height: 18 }} />
        </Stack>

        <StyledTooltip mode={'hover'} title={role}>
          <Typography
            color={'text.secondary'}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 'fit-content',
              maxWidth: '100%',
            }}
            variant={'body3'}
          >
            {role}
          </Typography>
        </StyledTooltip>
      </Stack>

      <StyledTooltip mode={'hover'} title={company}>
        <Typography
          alignSelf={'center'}
          maxWidth={'20%'}
          ml={'auto'}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          variant={'body3'}
        >
          {company}
        </Typography>
      </StyledTooltip>
    </Stack>
  );
};

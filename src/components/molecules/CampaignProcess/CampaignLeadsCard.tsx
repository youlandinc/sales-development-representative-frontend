import { FC } from 'react';
import { Avatar, Icon, Stack, Typography } from '@mui/material';

import { CampaignLeadItem } from '@/types';

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
      <Stack>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <Typography variant={'subtitle2'}>{name}</Typography>
          <Icon component={ICON_LINKEDIN} sx={{ width: 18, height: 18 }} />
        </Stack>
        <Typography color={'text.secondary'} variant={'body2'}>
          {role}
        </Typography>
      </Stack>
      <Typography alignSelf={'center'} ml={'auto'} variant={'body2'}>
        {company}
      </Typography>
    </Stack>
  );
};

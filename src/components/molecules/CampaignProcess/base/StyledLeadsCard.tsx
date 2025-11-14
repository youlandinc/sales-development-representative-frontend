import { FC } from 'react';
import { Avatar, Stack, SxProps, Typography } from '@mui/material';

import { CampaignLeadItem } from '@/types';

import { StyledTooltip } from '@/components/atoms';

interface CampaignLeadItemProps extends CampaignLeadItem {
  sx?: SxProps;
  onClick?: () => void;
  disabled?: boolean;
}

export const StyledLeadsCard: FC<CampaignLeadItemProps> = ({
  name,
  firstName,
  lastName,
  role,
  //company,
  backgroundColor,
  sx,
  avatar,
  disabled,
  onClick = () => {},
}) => {
  const avatarName = () => {
    const target = (firstName?.[0] ?? '') + (lastName?.[0] ?? '') || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  };

  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      gap={1}
      onClick={onClick}
      py={1.5}
      sx={sx}
      width={'100%'}
    >
      <Avatar
        src={avatar || ''}
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
      <Stack maxWidth={'60%'} width={'60%'}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <StyledTooltip mode={'hover'} title={name}>
            <Typography
              color={disabled ? 'text.disabled' : 'text.primary'}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: 'fit-content',
                maxWidth: '100%',
              }}
              variant={'subtitle2'}
            >
              {name}
            </Typography>
          </StyledTooltip>
        </Stack>

        <StyledTooltip mode={'hover'} title={role}>
          <Typography
            color={disabled ? 'text.disabled' : 'text.secondary'}
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
    </Stack>
  );
};

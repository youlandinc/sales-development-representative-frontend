import { FC, ReactNode } from 'react';
import { Avatar, Stack, SxProps, Typography } from '@mui/material';

type CommonReceiptCardHeaderProps = {
  avatarName?: string;
  avatarBgcolor?: string;
  avatarSx?: SxProps;
  avatarSrc?: string;
  prefix?: ReactNode;
  email: ReactNode;
  emailSx?: SxProps;
  time?: ReactNode;
  sx?: SxProps;
  handleAvatarClick?: () => void;
};

export const CommonReceiptCardHeader: FC<CommonReceiptCardHeaderProps> = ({
  avatarName,
  avatarBgcolor,
  email,
  emailSx,
  time,
  prefix,
  avatarSx,
  avatarSrc,
  sx,
  handleAvatarClick,
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      sx={sx}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1} sx={emailSx}>
        {prefix && prefix}
        <Avatar
          onClick={handleAvatarClick}
          src={avatarSrc}
          sx={{
            bgcolor: avatarBgcolor,
            height: 24,
            width: 24,
            fontSize: 12,
            fontWeight: 600,
            ...avatarSx,
          }}
        >
          {avatarName}
        </Avatar>
        <Typography component={'div'} variant={'subtitle2'}>
          {email}
        </Typography>
      </Stack>
      {time && (
        <Typography color={'#637381'} component={'div'} variant={'body3'}>
          {time}
        </Typography>
      )}
    </Stack>
  );
};

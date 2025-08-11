import { useRef, useState } from 'react';
import { Avatar, Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';

import { useUserStore } from '@/provides';
import { USystemLogout } from '@/utils';

import ICON_SIDE_LOGOUT from './assets/icon_side_logout.svg';

export const LayoutUserInfo = () => {
  const { userProfile, isHydration, resetUserStore } = useUserStore(
    (state) => state,
  );

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const avatarName = () => {
    if (!isHydration) {
      return '';
    }
    const target =
      userProfile?.firstName?.[0] + userProfile?.lastName?.[0] || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  };

  const avatarUrl = () => {
    if (!isHydration) {
      return '/images/placeholder_avatar.png';
    }
    if (!userProfile?.avatar) {
      if (!avatarName) {
        return '/images/placeholder_avatar.png';
      }
      return '';
    }
    return userProfile?.avatar;
  };

  const onClickToLogout = () => {
    setAnchorEl(null);
    USystemLogout();
    resetUserStore();
  };

  return (
    <>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={1}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        ref={avatarRef}
        sx={{ cursor: 'pointer' }}
      >
        <Avatar
          src={avatarUrl()}
          sx={{
            bgcolor: userProfile?.backgroundColor,
            width: 24,
            height: 24,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {avatarName()}
        </Avatar>
        <Typography variant={'body3'} whiteSpace={'nowrap'}>
          {userProfile?.name}
        </Typography>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            sx: {
              boxShadow:
                '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
              borderRadius: 2,
              '& .MuiList-root': {
                padding: 0,
              },
            },
          },
          list: {
            sx: {
              width: avatarRef.current?.offsetWidth,
              minWidth: 120,
            },
          },
        }}
        sx={{
          '& .MuiMenu-list': {
            p: 0,
            // Menu item default style
            '& .MuiMenuItem-root': {
              bgcolor: 'transparent !important',
            },
            '& .MuiMenuItem-root:hover': {
              bgcolor: 'rgba(144, 149, 163, 0.1) !important',
            },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => onClickToLogout()} sx={{ gap: 1.5 }}>
          <Icon component={ICON_SIDE_LOGOUT} />
          <Typography variant={'subtitle3'}>Log out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

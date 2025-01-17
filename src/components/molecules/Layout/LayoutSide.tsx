import { FC, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { useUserStore } from '@/provides';
import { useDialogStore } from '@/stores/useDialogStore';

import { USystemLogout } from '@/utils';

import { StyledButton } from '@/components/atoms';

import { LAYOUT_SIDE_MENU } from './Layout.data';

import ICON_EXPEND from './assets/icon_expend.svg';
import ICON_SIDE_LOGOUT from './assets/icon_side_logout.svg';

export const LayoutSide: FC = () => {
  const { userProfile, isHydration, resetUserStore } = useUserStore(
    (state) => state,
  );
  const { open } = useDialogStore();

  const router = useRouter();
  const pathname = usePathname();

  const [expend, setExpend] = useState(true);

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

  const ExpendIcon = () => (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      onClick={() => setExpend(!expend)}
      sx={{
        cursor: 'pointer',
        border: '1px solid #E5E5E5',
        borderRadius: '50%',
        height: 20,
        width: 20,
        position: 'absolute',
        right: -10,
        bgcolor: '#FFFFFF',
        top: 60,
      }}
    >
      <Icon
        component={ICON_EXPEND}
        sx={{
          height: 10,
          width: 10,
          transform: expend ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform .3s',
        }}
      />
    </Stack>
  );

  const onClickToRedirect = (key: string) => {
    if (pathname.includes(key)) {
      return;
    }
    router.push(key);
  };

  return (
    <Stack
      sx={{
        width: expend ? 230 : 60,
        height: '100%',
        borderRight: '1px solid #E5E5E5',
        bgcolor: '#FFFFFF',
        position: 'relative',
        px: expend ? 3 : 1.5,
        py: 4,
        transition: 'all .3s',
        flexShrink: 0,
      }}
    >
      <ExpendIcon />

      <Stack gap={0.5}>
        <Box
          bgcolor={'black'}
          borderRadius={5}
          height={expend ? 32 : 24}
          sx={{
            transition: 'all .3s',
          }}
          width={expend ? 48 : 32}
        />
        {expend && <Typography variant={'subtitle2'}>LOGO</Typography>}
      </Stack>

      <Stack
        sx={{
          width: '100%',
          mt: 4,
          overflowX: 'hidden',
        }}
      >
        {LAYOUT_SIDE_MENU.map((item, index) =>
          item.type === 'link' ? (
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={0.5}
              justifyContent={expend ? 'unset' : 'center'}
              key={`${item.key}-${index}`}
              onClick={() => onClickToRedirect(item.url)}
              py={1.5}
              sx={{
                cursor: 'pointer',
                transitions: 'all .3s',
                '& .layout_label': {
                  color: pathname.includes(item.key)
                    ? 'primary.main'
                    : 'text.primary',
                },
                '&:hover': {
                  '& .layout_icon': {
                    '& path': {
                      fill: pathname.includes(item.key) ? '' : '#6F6C7D',
                    },
                  },
                  '& .layout_label': {
                    color: pathname.includes(item.key)
                      ? 'primary.main'
                      : '#6F6C7D',
                  },
                },
              }}
            >
              <Icon
                className={'layout_icon'}
                component={
                  pathname.includes(item.key)
                    ? item.activeIcon
                    : item.defaultIcon
                }
              />

              {expend && (
                <Typography
                  className={'layout_label'}
                  mb={0.5}
                  variant={'body2'}
                >
                  {item.label}
                </Typography>
              )}
            </Stack>
          ) : (
            <Stack key={`${item.key}-${index}`} mb={1.5}>
              <StyledButton
                color={'info'}
                onClick={() => open()}
                size={'medium'}
                variant={'outlined'}
              >
                {expend ? 'Create new campaign' : '+'}
              </StyledButton>
            </Stack>
          ),
        )}
      </Stack>

      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={1}
        justifyContent={expend ? 'unset' : 'center'}
        mt={'auto'}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        ref={avatarRef}
        sx={{ cursor: 'pointer', overflowX: 'hidden' }}
        width={'100%'}
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
        {expend && (
          <Typography variant={'body3'} whiteSpace={'nowrap'}>
            {userProfile?.name}
          </Typography>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        MenuListProps={{
          sx: {
            width: avatarRef.current?.offsetWidth,
            minWidth: 120,
          },
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            sx: {
              mt: -3,
              boxShadow:
                '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
              borderRadius: 2,
              '& .MuiList-root': {
                padding: 0,
              },
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
            //'& .Mui-selected': {
            //  bgcolor: 'hsla(,100%,95%,1) !important',
            //},
            //'& .Mui-selected:hover': {
            //  bgcolor: 'hsla(,100%,92%,1) !important',
            //},
          },
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => onClickToLogout()} sx={{ gap: 1.5 }}>
          <Icon component={ICON_SIDE_LOGOUT} />
          <Typography variant={'subtitle3'}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

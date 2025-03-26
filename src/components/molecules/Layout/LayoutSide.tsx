import { FC, Fragment, useRef, useState } from 'react';
import {
  Avatar,
  Icon,
  Menu,
  MenuItem,
  Stack,
  SxProps,
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

import ICON_LOGO_EXPEND from './assets/icon_logo_expend.svg';

type StyledMenuItemProps = {
  expend?: boolean;
  active?: boolean;
  label?: string;
  activeIcon?: any;
  defaultIcon?: any;
  onClick?: () => void;
  sx?: SxProps;
};

const StyledMenuItem: FC<StyledMenuItemProps> = ({
  expend,
  label,
  active,
  activeIcon,
  defaultIcon,
  onClick,
  sx,
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      gap={0.5}
      justifyContent={expend ? 'unset' : 'center'}
      onClick={() => onClick?.()}
      py={1.5}
      sx={{
        cursor: 'pointer',
        transitions: 'all .3s',
        '& .layout_label': {
          color: active ? 'primary.main' : 'text.primary',
        },
        '&:hover': {
          '& .layout_icon': {
            '& path': {
              fill: active ? '' : '#6F6C7D',
            },
          },
          '& .layout_label': {
            color: active ? 'primary.main' : 'text.secondary',
          },
        },
        ...sx,
      }}
    >
      <Icon
        className={'layout_icon'}
        component={active ? activeIcon : defaultIcon}
      />

      {expend && (
        <Typography className={'layout_label'} mb={0.5} variant={'body2'}>
          {label}
        </Typography>
      )}
    </Stack>
  );
};

export const LayoutSide: FC = () => {
  const { userProfile, isHydration, resetUserStore } = useUserStore(
    (state) => state,
  );
  const { openProcess } = useDialogStore();

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
        border: '1px solid #DFDEE6',
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

  const isSelected = (key?: string) => pathname.includes(key || '');

  const onClickToRedirect = (key: string) => {
    if (isSelected(key)) {
      return;
    }
    router.push(key);
  };

  return (
    <Stack
      sx={{
        width: expend ? 230 : 60,
        height: '100%',
        borderRight: '1px solid #DFDEE6',
        bgcolor: '#FFFFFF',
        position: 'relative',
        px: expend ? 3 : 1.5,
        py: 4,
        transition: 'all .3s',
        flexShrink: 0,
      }}
    >
      <ExpendIcon />

      <Stack gap={0.5} overflow={'hidden'}>
        <Icon
          component={ICON_LOGO_EXPEND}
          sx={{
            ml: 0.25,
            height: expend ? 48 : 32,
            width: expend ? 146 : 98,
            transition: 'width .3s',
          }}
        />
      </Stack>

      <Stack
        sx={{
          width: '100%',
          mt: 4,
          overflowX: 'hidden',
        }}
      >
        <Stack mb={1.5}>
          <StyledButton
            color={'info'}
            onClick={() => openProcess()}
            size={'medium'}
            variant={'outlined'}
          >
            {expend ? 'Create new campaign' : '+'}
          </StyledButton>
        </Stack>
        {LAYOUT_SIDE_MENU.map((item, index) => (
          <Fragment key={index}>
            {item.subMenus && !expend ? null : (
              <StyledMenuItem
                active={isSelected(item.key)}
                activeIcon={item.activeIcon}
                defaultIcon={item.defaultIcon}
                expend={expend}
                key={`${item.key}-${index}`}
                label={item.label}
                onClick={() => (item.url ? onClickToRedirect(item.url) : false)}
                sx={{
                  cursor: item.url ? 'pointer' : 'default',
                }}
              />
            )}
            {item.subMenus && (
              <Stack pl={expend ? '28px' : 0}>
                {item.subMenus.map((subItem, i) => (
                  <StyledMenuItem
                    active={isSelected(subItem.key)}
                    activeIcon={subItem.activeIcon}
                    defaultIcon={subItem.defaultIcon}
                    expend={expend}
                    key={`${subItem.key}-${i}`}
                    label={subItem.label}
                    onClick={() => onClickToRedirect(subItem.url)}
                  />
                ))}
              </Stack>
            )}
          </Fragment>
        ))}
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

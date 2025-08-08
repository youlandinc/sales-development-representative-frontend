import { FC, Fragment, useEffect, useState } from 'react';
import { Icon, Stack, SxProps, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogStore } from '@/stores/useDialogStore';

import { StyledButton } from '@/components/atoms';

import { LAYOUT_SIDE_MENU } from './Layout.data';

import ICON_EXPEND from './assets/icon_expend.svg';

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
  const { openProcess } = useDialogStore();

  const router = useRouter();
  const pathname = usePathname();

  const [expend, setExpend] = useState(true);

  // 0 false, 1 true

  const ExpendIcon = () => (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      onClick={() => {
        setExpend(!expend);
        localStorage?.setItem('expend', !expend ? '1' : '0');
      }}
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

  useEffect(() => {
    if (localStorage.getItem('expend') === null) {
      localStorage.setItem('expend', '1');
    }
    if (localStorage.getItem('expend') === '1') {
      setExpend(true);
    }
  }, []);

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
      <Stack
        sx={{
          width: '100%',
          overflowX: 'hidden',
        }}
      >
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
                onClick={() => {
                  if (item.url) {
                    onClickToRedirect(item.url);
                    return;
                  }
                  if (item?.subMenus?.length) {
                    onClickToRedirect(item.subMenus[0].url);
                  }
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
        <Stack mt={3}>
          <StyledButton
            color={'info'}
            onClick={() => openProcess()}
            size={'medium'}
            variant={'outlined'}
          >
            {expend ? 'Create new campaign' : '+'}
          </StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

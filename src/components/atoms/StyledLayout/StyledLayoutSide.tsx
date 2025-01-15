import { FC, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { LAYOUT_SIDE_MENU } from './StyledLayout.data';

import { StyledButton } from '@/components/atoms';

import ICON_EXPEND from './assets/icon_expend.svg';

export const StyledLayoutSide: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [expend, setExpend] = useState(true);

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

  return (
    <Box
      sx={{
        width: expend ? 230 : 60,
        height: '100%',
        borderRight: '1px solid #E5E5E5',
        bgColor: '#FFFFFF',
        position: 'relative',
        px: expend ? 3 : 1.5,
        py: 4,
        transition: 'all .3s',
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
              onClick={() => router.push(item.url)}
              py={1.5}
              sx={{
                cursor: 'pointer',
                transitions: 'all .3s',
                '& .icon': {
                  '& path': {
                    fill: pathname.includes(item.key) ? '' : '#6F6C7D',
                  },
                },
                '& .label': {
                  color: pathname.includes(item.key)
                    ? 'primary.main'
                    : 'text.primary',
                },
                '&:hover': {
                  '& .icon': {
                    '& path': {
                      fill: pathname.includes(item.key) ? '' : '#6F6C7D',
                    },
                  },
                  '& .label': {
                    color: pathname.includes(item.key)
                      ? 'primary.main'
                      : '#6F6C7D',
                  },
                },
              }}
            >
              <Icon
                className={'icon'}
                component={
                  pathname.includes(item.key)
                    ? item.activeIcon
                    : item.defaultIcon
                }
              />

              {expend && (
                <Typography className={'label'} mb={0.5} variant={'body2'}>
                  {item.label}
                </Typography>
              )}
            </Stack>
          ) : (
            <Stack key={`${item.key}-${index}`} mb={1.5}>
              <StyledButton color={'info'} size={'medium'} variant={'outlined'}>
                {expend ? 'Create new campaign' : '+'}
              </StyledButton>
            </Stack>
          ),
        )}
      </Stack>
    </Box>
  );
};

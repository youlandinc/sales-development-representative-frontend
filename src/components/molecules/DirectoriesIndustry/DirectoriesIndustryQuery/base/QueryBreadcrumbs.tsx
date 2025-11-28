import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import ICON_BACK from './assets/icon-back.svg';

interface QueryBreadcrumbsProps {
  current: string;
}

export const QueryBreadcrumbs: FC<QueryBreadcrumbsProps> = ({ current }) => {
  const router = useRouter();
  return (
    <>
      <Stack
        sx={{
          flexDirection: 'row',
          gap: 0.5,
          fontSize: 12,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            gap: 0.5,
            fontSize: 12,
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              '& > .previous': {
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationSkipInk: 'none',
                textDecorationThickness: 'auto',
                textUnderlineOffset: 'auto',
                textUnderlinePosition: 'from-font',
              },
            },
          }}
        >
          <Icon component={ICON_BACK} sx={{ width: 12, height: 12 }} />
          <Typography
            className={'previous'}
            onClick={() => router.push('/directories')}
            sx={{
              fontSize: 12,
              color: 'text.focus',
            }}
          >
            Directory
          </Typography>
        </Stack>
        /
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 12,
          }}
        >
          {current}
        </Typography>
      </Stack>
    </>
  );
};

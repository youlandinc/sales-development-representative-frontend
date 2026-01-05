import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { QueryIcon } from './index';

interface QueryBreadcrumbsProps {
  current: string;
}

export const QueryBreadcrumbs: FC<QueryBreadcrumbsProps> = ({ current }) => {
  const router = useRouter();
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: 0.5,
        fontSize: 12,
      }}
    >
      <Stack
        onClick={() => router.push('/directories')}
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
        <QueryIcon.Back />
        <Typography
          className={'previous'}
          sx={{
            fontSize: 12,
            color: 'text.focus',
          }}
        >
          Directories
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
  );
};

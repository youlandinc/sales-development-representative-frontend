import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

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
        <Typography
          onClick={() => router.push('/directories')}
          sx={{
            fontSize: 12,
            color: 'text.focus',
            cursor: 'pointer',
            '&:hover': {
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationSkipInk: 'none',
              textDecorationThickness: 'auto',
              textUnderlineOffset: 'auto',
              textUnderlinePosition: 'from-font',
            },
          }}
        >
          Directory
        </Typography>
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

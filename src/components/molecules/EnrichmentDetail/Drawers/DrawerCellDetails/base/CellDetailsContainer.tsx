import { Fade, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { CellDetailsHeader } from './CellDetailsHeader';

interface CellDetailsContainerProps {
  loading?: boolean;
  isEmpty?: boolean;
}

export const CellDetailsContainer: FC<
  PropsWithChildren<CellDetailsContainerProps>
> = ({ loading, isEmpty, children }) => {
  if (loading) {
    return (
      <Stack>
        <CellDetailsHeader />
        <Typography
          sx={{ color: 'text.secondary', lineHeight: 1.4, textAlign: 'center' }}
          variant={'body2'}
        >
          Loading progress......
        </Typography>
      </Stack>
    );
  }
  //no data
  if (isEmpty) {
    return (
      <Stack>
        <CellDetailsHeader />
        <Fade in>
          <Typography
            sx={{
              color: 'text.secondary',
              lineHeight: 1.4,
              textAlign: 'center',
            }}
            variant={'body2'}
          >
            No records found
          </Typography>
        </Fade>
      </Stack>
    );
  }

  return (
    <Fade in>
      <Stack height={'100%'}>
        <CellDetailsHeader />
        {children}
      </Stack>
    </Fade>
  );
};

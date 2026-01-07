import { Fade, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { DialogCellDetailsHeader } from './DialogCellDetailsHeader';

interface DialogCellDetailsContainerProps {
  loading?: boolean;
  isEmpty?: boolean;
}

export const DialogCellDetailsContainer: FC<
  PropsWithChildren<DialogCellDetailsContainerProps>
> = ({ loading, isEmpty, children }) => {
  if (loading) {
    return (
      <Stack>
        <DialogCellDetailsHeader />
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
        <DialogCellDetailsHeader />
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
        <DialogCellDetailsHeader />
        {children}
      </Stack>
    </Fade>
  );
};

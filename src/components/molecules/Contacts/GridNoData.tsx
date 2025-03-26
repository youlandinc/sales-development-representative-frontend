import { FC } from 'react';
import { Icon, Stack } from '@mui/material';

import ICON_NO_DATA from './assets/icon_no_data.svg';

export const GridNoData: FC = () => {
  // const { visible, open, close } = useSwitch();
  return (
    <>
      <Stack
        alignItems={'center'}
        flex={1}
        height={'100%'}
        justifyContent={'center'}
        textAlign={'center'}
      >
        <Stack gap={1.25}>
          <Icon component={ICON_NO_DATA} sx={{ width: 256, height: 236 }} />
          {/*<Box>
            <Typography variant={'body2'}>
              You don’t have any contacts yet.
            </Typography>
            <Typography
              color={'primary'}
              onClick={open}
              sx={{ cursor: 'pointer' }}
              variant={'body2'}
            >
              Create a contact
            </Typography>
          </Box>*/}
        </Stack>
      </Stack>
    </>
  );
};

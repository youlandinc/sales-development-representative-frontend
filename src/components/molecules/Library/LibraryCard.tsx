import { FC, PropsWithChildren, ReactNode } from 'react';
import { Icon, Stack, SxProps, Typography } from '@mui/material';

import ICON_NO_RESULT from './assets/icon_no_result.svg';

export type LibraryCardProps = {
  sx?: SxProps;
  title?: ReactNode | string;
  icon?: ReactNode;
};

export const StyledNoResult = () => {
  return (
    <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
      <Icon component={ICON_NO_RESULT} sx={{ width: 256, height: 236 }} />
    </Stack>
  );
};

export const LibraryCard: FC<PropsWithChildren<LibraryCardProps>> = ({
  children,
  sx,
  title,
  icon,
}) => {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'#DFDEE6'}
      borderRadius={2}
      gap={1.5}
      p={3}
      sx={sx}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
        {icon && icon}
        {typeof title === 'string' ? (
          <Typography component={'div'} fontWeight={600} lineHeight={1.2}>
            {title}
          </Typography>
        ) : (
          title && title
        )}
      </Stack>
      {children}
      {/*<StyledNoResult />*/}
    </Stack>
  );
};

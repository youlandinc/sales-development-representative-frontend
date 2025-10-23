import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

export type FilterContainerProps = { title: ReactNode; subTitle?: ReactNode };

export const FilterContainer: FC<PropsWithChildren<FilterContainerProps>> = ({
  title,
  subTitle,
  children,
}) => {
  return (
    <Stack gap={1}>
      <Stack>
        <Typography component={'div'} variant={'body3'}>
          {title}
        </Typography>
        {subTitle && (
          <Typography color={'#B0ADBD'} component={'div'} variant={'body3'}>
            {subTitle}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
};

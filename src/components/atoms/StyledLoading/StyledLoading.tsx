import { CircularProgress, CircularProgressProps } from '@mui/material';
import { FC } from 'react';

export interface StyledLoadingProps
  extends Omit<CircularProgressProps, 'size'> {
  size: 'small' | 'medium' | 'large' | string | number;
}

export const StyledLoading: FC<StyledLoadingProps> = ({
  size = 'small',
  sx,
  ...rest
}) => {
  const inSideSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 20;
      case 'large':
        return 28;
      default:
        return size;
    }
  };

  return (
    <CircularProgress
      size={inSideSize()}
      sx={{
        color: '#DFDEE6',
        m: '0 auto',
        ...sx,
      }}
      {...rest}
    />
  );
};

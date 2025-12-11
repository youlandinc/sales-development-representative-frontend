import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import Image from 'next/image';

interface StyledImageProps extends BoxProps {
  url: string;
}

export const StyledImage: FC<StyledImageProps> = ({ url, ...rest }) => {
  return (
    <Box {...rest}>
      <Image alt="" fill sizes={'100%'} src={url} />
    </Box>
  );
};

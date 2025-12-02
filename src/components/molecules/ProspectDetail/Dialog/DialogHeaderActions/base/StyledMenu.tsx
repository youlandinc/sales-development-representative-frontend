import { Stack, StackProps, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, ReactNode } from 'react';

interface StyledMenuProps extends Omit<StackProps, 'slot'> {
  iconUrl?: string;
  name: string;
  onClick: () => void;
  slot?: ReactNode;
}

export const StyledMenu: FC<StyledMenuProps> = ({
  iconUrl,
  name,
  onClick,
  sx,
  slot,
  ...rest
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      onClick={onClick}
      px={1.5}
      py={0.5}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#F4F5F9',
        },
        ...sx,
      }}
      {...rest}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={0.5}
        justifyContent={'space-between'}
      >
        {iconUrl && <Image alt={name} height={20} src={iconUrl} width={20} />}
        <Typography fontSize={14} lineHeight={1.2}>
          {name}
        </Typography>
      </Stack>
      {slot}
    </Stack>
  );
};

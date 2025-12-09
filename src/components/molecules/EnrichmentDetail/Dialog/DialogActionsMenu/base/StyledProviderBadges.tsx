import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';

interface StyledProviderBadgesProps {
  providers: string[];
}

export const StyledProviderBadges: FC<StyledProviderBadgesProps> = ({
  providers,
}) => {
  return (
    <Stack
      flexDirection={'row'}
      sx={{
        position: 'relative',
        height: 18,
      }}
    >
      {providers.map((provider, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            width: 18,
            height: 18,
            border: '1px solid',
            borderColor: '#F4F5F9',
            borderRadius: '50%',
            overflow: 'hidden',
            bgcolor: 'white',
            marginLeft: index > 0 ? '-6px' : 0,
            zIndex: providers.length - index,
          }}
        >
          <Image
            alt={`Provider ${index + 1}`}
            fill
            src={provider}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      ))}
    </Stack>
  );
};

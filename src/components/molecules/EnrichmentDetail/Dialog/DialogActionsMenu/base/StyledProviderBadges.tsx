import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';

interface StyledProviderBadgesProps {
  providers: string[];
  maxCount?: number;
}

export const StyledProviderBadges: FC<StyledProviderBadgesProps> = ({
  providers,
  maxCount,
}) => {
  const displayProviders = maxCount ? providers.slice(0, maxCount) : providers;

  return (
    <Stack
      flexDirection={'row'}
      sx={{
        position: 'relative',
        height: 18,
      }}
    >
      {displayProviders.map((provider, index) => (
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
            zIndex: displayProviders.length - index,
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

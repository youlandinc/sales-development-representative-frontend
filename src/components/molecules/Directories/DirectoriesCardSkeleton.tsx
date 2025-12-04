import { FC } from 'react';
import { Skeleton, Stack } from '@mui/material';

import { DIRECTORIES_COLORS } from './constants';

interface DirectoriesCardSkeletonProps {
  isDark?: boolean;
}

export const DirectoriesCardSkeleton: FC<DirectoriesCardSkeletonProps> = ({
  isDark = false,
}) => {
  const colors = isDark ? DIRECTORIES_COLORS.dark : DIRECTORIES_COLORS.light;

  return (
    <Stack
      sx={{
        position: 'relative',
        backgroundColor: colors.card.background,
        border: `1px solid ${colors.card.border}`,
        borderRadius: 4,
        padding: 3,
        gap: 6,
        minHeight: 308,
        width: 515,
        flexShrink: 0,
      }}
    >
      <Stack gap="12px" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="8px">
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <Skeleton
              height={48}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
              variant="rounded"
              width={48}
            />
            {/* Badge */}
            <Skeleton
              height={22}
              sx={{
                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined,
                borderRadius: 1,
              }}
              variant="rounded"
              width={80}
            />
          </Stack>

          {/* Title */}
          <Skeleton
            height={32}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
            variant="text"
            width={200}
          />
        </Stack>

        {/* Description */}
        <Stack gap={0.5}>
          <Skeleton
            height={20}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
            variant="text"
            width="100%"
          />
          <Skeleton
            height={20}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
            variant="text"
            width="80%"
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Button */}
        <Skeleton
          height={40}
          sx={{
            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined,
            borderRadius: 2,
          }}
          variant="rounded"
          width={120}
        />

        {/* Stats */}
        <Stack alignItems="flex-end" gap={0.25}>
          <Skeleton
            height={18}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
            variant="text"
            width={100}
          />
          <Skeleton
            height={18}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
            variant="text"
            width={80}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

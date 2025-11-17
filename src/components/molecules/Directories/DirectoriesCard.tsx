import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import {
  DirectoriesBizIdEnum,
  DirectoryApiResponse,
} from '@/types/Directories';

import { StyledButton } from '@/components/atoms';

import {
  DirectoriesBadge,
  DirectoriesPattern,
  DirectoriesStats,
} from './index';
import { DIRECTORIES_COLORS } from './constants';

type DirectoriesCardProps = DirectoryApiResponse & {
  onButtonClick?: (data: {
    bizId: DirectoriesBizIdEnum;
    isAuth: boolean;
  }) => void;
};

export const DirectoriesCard: FC<DirectoriesCardProps> = ({
  bizId,
  title,
  description,
  logo,
  periodCount,
  statPeriod,
  isAuth,
  buttonDescription,
  planType,
  onButtonClick,
}) => {
  const isDark = bizId === DirectoriesBizIdEnum.capital_markets;
  const colors = isDark ? DIRECTORIES_COLORS.dark : DIRECTORIES_COLORS.light;

  return (
    <Box
      sx={{
        backgroundColor: colors.card.background,
        border: `1px solid ${colors.card.border}`,
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '308px',
        width: '515px',
        flexShrink: 0,
      }}
    >
      {isDark && <DirectoriesPattern />}

      <Stack gap="12px" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="8px">
          <Stack
            alignItems="flex-start"
            bgcolor={'linear-gradient(90deg, #FEF1D7 0%, #D5BB9B 100%)'}
            direction="row"
            justifyContent="space-between"
          >
            <Box
              alt={title}
              component={'img'}
              src={logo}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
              }}
            />
            {isAuth && (
              <DirectoriesBadge variant={isDark ? 'intelligence' : 'active'} />
            )}
          </Stack>

          <Typography
            sx={{
              color: colors.title,
              lineHeight: 1.2,
            }}
            variant={'h5'}
          >
            {title}
          </Typography>
        </Stack>

        <Typography
          sx={{
            color: colors.description,
            fontSize: 14,
            lineHeight: 1.4,
            maxWidth: 360,
          }}
        >
          {description}
        </Typography>
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
        <StyledButton
          onClick={() => onButtonClick?.({ bizId, isAuth })}
          size={'medium'}
          sx={{
            backgroundColor: `${colors.button.background} !important`,
            color: `${colors.button.color} !important`,
            '&:hover': {
              backgroundColor: `${colors.button.hover} !important`,
            },
          }}
          variant={'contained'}
        >
          {buttonDescription}
        </StyledButton>

        <DirectoriesStats
          isDark={isDark}
          periodCount={periodCount}
          statPeriod={statPeriod}
        />
      </Stack>
    </Box>
  );
};

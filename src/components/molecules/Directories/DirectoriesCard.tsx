import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { DIRECTORIES_COLORS } from './constants';

import {
  DirectoriesBizIdEnum,
  DirectoryApiResponse,
} from '@/types/directories';

import { StyledButton } from '@/components/atoms';
import {
  DirectoriesBadge,
  DirectoriesPattern,
  DirectoriesStats,
} from './index';

type DirectoriesCardProps = DirectoryApiResponse & {
  onButtonClick?: (data: {
    bizId: DirectoriesBizIdEnum;
    isAuth: boolean;
  }) => void;
  buttonLoading: boolean;
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
  planLogo,
  planName,
  onButtonClick,
  buttonLoading,
}) => {
  const isDark = bizId === DirectoriesBizIdEnum.capital_markets;
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
      {isDark && <DirectoriesPattern />}

      <Stack gap="12px" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="8px">
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              bgcolor: 'linear-gradient(90deg, #FEF1D7 0%, #D5BB9B 100%)',
            }}
          >
            <Box
              alt={title}
              component={'img'}
              src={logo}
              sx={{
                width: 48,
                height: 48,
                objectFit: 'contain',
              }}
            />
            {isAuth && (
              <DirectoriesBadge
                planLogo={planLogo || ''}
                planName={planName || ''}
                variant={isDark ? 'capital' : 'other'}
              />
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
          disabled={buttonLoading}
          loading={buttonLoading}
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
    </Stack>
  );
};

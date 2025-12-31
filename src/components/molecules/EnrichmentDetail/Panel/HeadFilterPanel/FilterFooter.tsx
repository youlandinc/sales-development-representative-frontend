import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';

import ICON_ADD from './asset/icon-add.svg';
import ICON_CLEAR from './asset/icon-clear.svg';

interface FilterFooterProps {
  onClickToAddGroup?: () => Promise<void>;
  onClickToClearAll?: () => Promise<void>;
  disabled?: boolean;
}

export const FilterFooter: FC<FilterFooterProps> = ({
  disabled,
  onClickToAddGroup,
  onClickToClearAll,
}) => {
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>or</Typography>
      <StyledButton
        color={'info'}
        onClick={onClickToAddGroup}
        size={'small'}
        sx={{ width: 130 }}
        variant={'outlined'}
      >
        <Icon component={ICON_ADD} sx={{ width: 12, height: 12, mr: 1 }} />
        Add filter group
      </StyledButton>

      <Stack
        className={disabled ? 'disabled' : ''}
        onClick={onClickToClearAll}
        sx={{
          gap: 0.5,
          fontSize: 12,
          alignItems: 'center',
          color: 'primary.main',
          cursor: 'pointer',
          flexDirection: 'row',
          ml: 'auto',
          userSelect: 'none',
          '&.disabled,&.disabled:hover': {
            cursor: 'default',
            color: '#D0CEDA',
            '& .icon': {
              '& path': {
                fill: '#D0CEDA',
              },
            },
          },
          '&:hover': {
            color: '#6F6C7D',
            '& .icon': {
              '& path': {
                fill: '#6F6C7D',
              },
            },
          },
        }}
      >
        <Icon
          className={'icon'}
          component={ICON_CLEAR}
          sx={{ width: 18, height: 18 }}
        />
        Clear all filters
      </Stack>
    </Stack>
  );
};

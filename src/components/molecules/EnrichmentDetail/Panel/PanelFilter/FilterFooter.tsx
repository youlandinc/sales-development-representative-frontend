import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { PanelIcon } from '../PanelIcon';

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
        <PanelIcon.FilterAdd sx={{ mr: 1 }} />
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
        <PanelIcon.FilterClear className={'icon'} />
        Clear all filters
      </Stack>
    </Stack>
  );
};

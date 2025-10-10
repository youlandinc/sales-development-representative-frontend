import { Collapse, Icon, Stack, Switch, Typography } from '@mui/material';
import { FC } from 'react';
import { useSwitch } from '@/hooks/useSwitch';

import { StyledButton, StyledSwitch } from '@/components/atoms';

import ICON_DELETE from '../../assets/dialog/Icon_delete_default.svg';
import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';
import ICON_DRAG from '../../assets/dialog/icon_drag.svg';
import ICON_PLUS from '../../assets/dialog/icon_plus.svg';

export const DialogWorkEmailSequence: FC = () => {
  const { visible, toggle } = useSwitch(true);
  return (
    <Stack
      border={'1px solid #DFDEE6'}
      borderRadius={2}
      gap={visible ? 1.5 : 0}
      p={1.5}
      sx={{ transition: 'all 0.3s ease-in-out' }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={toggle}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Typography variant={'subtitle2'}>Waterfall sequence</Typography>
        <Icon
          component={ICON_ARROW}
          sx={{
            width: 16,
            height: 16,
            transform: visible ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Stack>
      <Collapse in={visible} timeout={300}>
        <Stack gap={1.5}>
          <Typography variant={'subtitle2'}>Actions</Typography>
          <Typography variant={'body3'}>
            Drag these actions to rearrange the order. Toggling off a step skips
            it.
          </Typography>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={3}
            justifyContent={'space-between'}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Stack
              alignItems={'center'}
              flex={1}
              flexDirection={'row'}
              gap={0.5}
            >
              <Icon component={ICON_DRAG} sx={{ width: 18, height: 18 }} />
              <Stack
                alignItems={'center'}
                borderRadius={1}
                boxShadow={'0 0 2px 0 rgba(52, 50, 62, 0.35)'}
                flex={1}
                flexDirection={'row'}
                justifyContent={'space-between'}
                px={1}
                py={0.5}
              >
                <Typography variant={'body3'}>Drag to rearrange</Typography>
                <Icon
                  component={ICON_ARROW}
                  sx={{
                    width: 12,
                    height: 12,
                    transform: 'rotate(-90deg)',
                  }}
                />
              </Stack>
            </Stack>
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <StyledSwitch />
              <Icon component={ICON_DELETE} sx={{ width: 18, height: 18 }} />
            </Stack>
          </Stack>
          <StyledButton
            color={'info'}
            size={'small'}
            sx={{
              borderColor: '#E5E5E5 !important',
              fontWeight: 400,
              color: '#6F6C7D !important',
            }}
            variant={'outlined'}
          >
            <Icon component={ICON_PLUS} sx={{ width: 18, height: 18 }} /> Add
            action
          </StyledButton>
        </Stack>
      </Collapse>
    </Stack>
  );
};

import { Collapse, Icon, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { DialogWorkEmailCustomSelect } from './index';

import { useSwitch } from '@/hooks/useSwitch';

import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailQuickSetup: FC = () => {
  const { visible, toggle } = useSwitch(true);
  const [input, setInput] = useState<any>();
  const [input2, setInput2] = useState<any>();

  return (
    <Stack gap={4}>
      <Stack
        border={'1px solid #DFDEE6'}
        borderRadius={2}
        gap={visible ? 1 : 0}
        p={1.5}
        sx={{
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={toggle}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Typography variant={'subtitle2'}>Inputs</Typography>
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
          <Stack gap={1}>
            <Typography variant={'body3'}>
              We automatically try to map the correct columns for you. If any
              inputs are empty, just select the columns you want to map. Once
              all inputs are filled, you&apos;re ready to save and run!
            </Typography>
            <DialogWorkEmailCustomSelect
              onChange={(_, value) => setInput(value)}
              title={'Input'}
              value={input}
            />
            <DialogWorkEmailCustomSelect
              onChange={(_, value) => setInput2(value)}
              title={'Input'}
              value={input2}
            />
          </Stack>
        </Collapse>
      </Stack>
    </Stack>
  );
};

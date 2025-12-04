import { FC, MouseEvent, useState } from 'react';
import { Icon, Popover, Stack, SxProps, Typography } from '@mui/material';

import ICON_OPENAI from '../assets/icon_openai.svg';
import ICON_DEEPSEEK from '../assets/icon_deepseek.svg';
import ICON_ARROW_DOWN from '../assets/icon_arrow_down.svg';

import { AIModelEnum } from '@/types';

interface StyledSwitchModelProps {
  sx?: SxProps;
  value: AIModelEnum;
  onSelect: (value: AIModelEnum) => Promise<void>;
  loading: boolean;
}

export const StyledSwitchModel: FC<StyledSwitchModelProps> = ({
  sx,
  value = AIModelEnum.open_ai,
  onSelect,
  loading,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const onClickOpenMenu = (event: MouseEvent<HTMLElement>) => {
    if (loading) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const onClickToCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Stack sx={sx}>
      <Stack
        alignItems={'center'}
        bgcolor={loading ? '#F0F0F4' : '#FFF'}
        borderRadius={2}
        flexDirection={'row'}
        gap={'2px'}
        maxWidth={155}
        onClick={(e) => onClickOpenMenu(e)}
        p={'4px 12px'}
        sx={{
          '&:hover': {
            bgcolor: loading ? '#F0F0F4' : '#F4F4F6',
          },
        }}
      >
        <Icon
          component={DEFAULT_HASH[value].icon!}
          sx={{
            width: 24,
            height: 24,
            '& > path': {
              fill: loading ? '#BABCBE' : '#6F6C7D',
            },
          }}
        />
        <Typography
          color={loading ? 'text.disabled' : 'text.secondary'}
          variant={'body2'}
        >
          {DEFAULT_HASH[value].label!}
        </Typography>
        <Icon
          component={ICON_ARROW_DOWN}
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all .3s',
            width: 16,
            height: 16,
            '& > path': {
              fill: loading ? '#BABCBE' : '#6F6C7D',
            },
          }}
        />
      </Stack>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={open}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              boxShadow:
                '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
              borderRadius: 2,
              '& .MuiList-root': {
                padding: 0,
              },
            },
          },
        }}
      >
        <Stack bgcolor={'#fff'} pb={1.5} width={220}>
          <Typography color={'text.secondary'} fontSize={12} px={3} py={1.5}>
            Switch model
          </Typography>
          {AI_MODEL_OPTIONS.map((item, index) => (
            <Stack
              bgcolor={value === item.value ? '#F0F4FF' : '#fff'}
              color={value === item.value ? 'primary.main' : 'text.primary'}
              fontSize={12}
              key={`${item.label}-${index}`}
              onClick={async () => {
                onClickToCloseMenu();
                await onSelect(item.value);
              }}
              px={3}
              py={1.25}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F4F4F6' } }}
            >
              {item.label}
            </Stack>
          ))}
        </Stack>
      </Popover>
    </Stack>
  );
};

const DEFAULT_HASH = {
  [AIModelEnum.open_ai]: { icon: ICON_OPENAI, label: 'ChatGPT-4o' },
  [AIModelEnum.deep_seek]: { icon: ICON_DEEPSEEK, label: 'Deepseek v3' },
};

const AI_MODEL_OPTIONS = [
  {
    label: 'ChatGPT-4o',
    value: AIModelEnum.open_ai,
    key: AIModelEnum.open_ai,
  },
  {
    label: 'Deepseek v3',
    value: AIModelEnum.deep_seek,
    key: AIModelEnum.deep_seek,
  },
];

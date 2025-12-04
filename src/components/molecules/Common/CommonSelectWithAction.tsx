import { FC, MouseEvent, ReactNode, useState } from 'react';
import { Icon, Popover, Stack, SxProps, Typography } from '@mui/material';

import ICON_TRIANGLE from './assets/icon_triangle.svg';
import { StyledLoading } from '@/components/atoms';

interface CommonSelectWithActionProps {
  options: TOption[];
  actionsNode?: ReactNode;
  onSelect: (value: any) => Promise<void> | void;
  value: any;
  loading?: boolean;
  containerSx?: SxProps;
  labelSx?: SxProps;
  menuTips?: ReactNode;
  defaultValue?: string;
  noOptionTip?: string;
}

export const CommonSelectWithAction: FC<CommonSelectWithActionProps> = ({
  options,
  actionsNode,
  onSelect,
  value,
  loading = false,
  containerSx,
  labelSx,
  defaultValue,
  noOptionTip,
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
    <Stack sx={containerSx}>
      <Stack
        alignItems={'center'}
        borderRadius={2}
        flexDirection={'row'}
        gap={'2px'}
        height={48}
        onClick={(e) => onClickOpenMenu(e)}
        px={1.5}
        sx={{
          borderWidth: '1px ',
          borderStyle: 'solid',
          cursor: loading ? 'default' : 'pointer',
          borderColor: loading ? 'border.disabled' : '#DFDEE6',
          '&:hover': {
            borderColor: loading ? 'border.disabled' : '#2a292e',
          },
          ...labelSx,
        }}
      >
        {loading ? (
          <Stack alignItems={'center'} justifyContent={'center'} width={80}>
            <StyledLoading size={16} sx={{ m: '0 0 0 8px' }} />
          </Stack>
        ) : (
          <Typography
            color={loading ? 'text.disabled' : 'text.primary'}
            variant={'body2'}
          >
            {options.find((item) => item.value === value)?.label ||
              defaultValue}
          </Typography>
        )}

        <Icon
          component={ICON_TRIANGLE}
          sx={{ width: 12, height: 12, ml: 0.5 }}
        />
      </Stack>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
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
              p: 1.5,
            },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack bgcolor={'#fff'} minWidth={360} pb={1.5}>
          {options.length === 0 && noOptionTip && (
            <Typography
              color={'text.secondary'}
              px={3}
              py={1.5}
              variant={'body2'}
            >
              {noOptionTip}
            </Typography>
          )}
          {options.map((item, index) => (
            <Stack
              bgcolor={value === item.value ? '#F4F5F9' : '#fff'}
              borderRadius={2}
              color={value === item.value ? 'primary.main' : 'text.primary'}
              fontSize={14}
              key={`${item.label}-${index}`}
              onClick={async () => {
                onClickToCloseMenu();
                await onSelect(item.value);
              }}
              px={1.5}
              py={1.25}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F4F4F6' } }}
            >
              {item.label}
            </Stack>
          ))}

          {actionsNode}
        </Stack>
      </Popover>
    </Stack>
  );
};

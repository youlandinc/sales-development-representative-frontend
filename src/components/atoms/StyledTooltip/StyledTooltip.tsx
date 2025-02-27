import { ElementType, FC } from 'react';
import {
  ClickAwayListener,
  Stack,
  SxProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';

import { useSwitch } from '@/hooks';

const SxStyle = {
  fontSize: 12,
  fontWeight: 400,
  bgcolor: 'background.default',
  color: 'text.primary',
  border: '1px solid #DFDEE6',
  p: 1.5,
  borderRadius: 2,
  '&.darker': {
    bgcolor: 'text.primary',
    color: 'white',
    '& .MuiTooltip-arrow': {
      color: 'text.primary',
    },
  },
};

export interface StyledTooltipProps extends TooltipProps {
  theme?: 'darker' | 'main';
  sx?: SxProps;
  isDisabledClose?: boolean;
  tooltipSx?: SxProps;
  component?: ElementType;
  mode?: 'click' | 'hover' | 'for-select' | 'controlled' | 'none';
  forSelectState?: boolean;
}

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  theme = 'main',
  tooltipSx = { width: '100%' },
  component = 'div',
  mode = 'click',
  forSelectState,
  ...rest
}) => {
  const { open, close, visible } = useSwitch(false);

  const renderTooltip = () => {
    switch (mode) {
      case 'click':
        return (
          <ClickAwayListener onClickAway={close}>
            <Tooltip
              arrow
              classes={{ tooltip: theme }}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              onClose={close}
              open={visible}
              slotProps={{
                popper: {
                  disablePortal: true,
                },
                tooltip: {
                  sx: {
                    ...SxStyle,
                    ...sx,
                  },
                },
                arrow: {
                  sx: {
                    '&:before': {
                      border: '1px solid #E6E8ED',
                    },
                    color: 'white',
                  },
                },
              }}
              {...rest}
            >
              <Stack
                component={component}
                onClick={() => (visible ? close() : open())}
                sx={{ width: '100%', ...tooltipSx }}
              >
                {children ? children : <span>{rest.title}</span>}
              </Stack>
            </Tooltip>
          </ClickAwayListener>
        );
      case 'hover':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            disableFocusListener
            disableTouchListener
            slotProps={{
              tooltip: {
                sx: {
                  ...SxStyle,
                  ...sx,
                },
              },
              arrow: {
                sx: {
                  '&:before': {
                    border: '1px solid #E6E8ED',
                  },
                  color: 'white',
                },
              },
            }}
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'for-select':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            disableHoverListener
            open={forSelectState}
            slotProps={{
              tooltip: {
                sx: {
                  ...SxStyle,
                  ...sx,
                },
              },
              arrow: {
                sx: {
                  '&:before': {
                    border: '1px solid #E6E8ED',
                  },
                  color: 'white',
                },
              },
            }}
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'controlled':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            onClick={visible ? close : open}
            onClose={close}
            onOpen={open}
            open={visible}
            slotProps={{
              tooltip: {
                sx: {
                  ...SxStyle,
                  ...sx,
                },
              },
              arrow: {
                sx: {
                  '&:before': {
                    border: '1px solid #E6E8ED',
                  },
                  color: 'white',
                },
              },
            }}
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'none':
        return children;
      default:
        return null;
    }
  };

  return renderTooltip();
};

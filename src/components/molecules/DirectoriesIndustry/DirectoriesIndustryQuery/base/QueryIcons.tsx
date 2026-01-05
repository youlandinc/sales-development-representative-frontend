import { CircularProgress, Icon, SvgIconProps } from '@mui/material';

import { StyledImage } from '@/components/atoms';

import ICON_CLOSE_SVG from './assets/icon-close.svg';
import ICON_ARROW_SVG from './assets/icon-arrow.svg';
import ICON_ARROW_DOWN_SVG from './assets/icon-arrow-down.svg';
import ICON_INFO_SVG from './assets/icon-info.svg';
import ICON_LOCK_SVG from './assets/icon-lock.svg';
import ICON_BACK_SVG from './assets/icon-back.svg';
import ICON_FIRM_DEFAULT_SVG from './assets/icon-firm-default.svg';
import ICON_FIRM_ACTIVE_SVG from './assets/icon-firm-active.svg';
import ICON_EXECUTIVE_DEFAULT_SVG from './assets/icon-executive-default.svg';
import ICON_EXECUTIVE_ACTIVE_SVG from './assets/icon-executive-active.svg';

const CHECKBOX_SX = { width: 20, height: 20, position: 'relative' };

type IconSize = 12 | 14 | 16 | 20;

export const QueryIcon = {
  Close: ({ size = 14, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_CLOSE_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Arrow: ({ size = 14, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_ARROW_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ArrowDown: ({
    size = 14,
    isOpen,
    ...props
  }: SvgIconProps & { size?: IconSize; isOpen?: boolean }) => (
    <Icon
      component={ICON_ARROW_DOWN_SVG}
      {...props}
      sx={{
        width: size,
        height: size,
        transform: isOpen ? 'rotate(0.5turn)' : 'none',
        ...props.sx,
      }}
    />
  ),

  Info: ({ size = 12, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_INFO_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Lock: ({ size = 11, ...props }: SvgIconProps & { size?: number }) => (
    <Icon
      component={ICON_LOCK_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Back: ({ size = 12, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_BACK_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Firm: ({
    size = 20,
    isActive,
    ...props
  }: SvgIconProps & { size?: IconSize; isActive?: boolean }) => (
    <Icon
      component={isActive ? ICON_FIRM_ACTIVE_SVG : ICON_FIRM_DEFAULT_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Executive: ({
    size = 20,
    isActive,
    ...props
  }: SvgIconProps & { size?: IconSize; isActive?: boolean }) => (
    <Icon
      component={
        isActive ? ICON_EXECUTIVE_ACTIVE_SVG : ICON_EXECUTIVE_DEFAULT_SVG
      }
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // Loading spinner
  Loading: () => <CircularProgress size="20px" sx={{ color: '#D0CEDA' }} />,

  // Checkbox icons
  CheckboxChecked: () => (
    <StyledImage sx={CHECKBOX_SX} url="/images/icon-checkbox-check.svg" />
  ),
  CheckboxUnchecked: () => (
    <StyledImage sx={CHECKBOX_SX} url="/images/icon-checkbox-static.svg" />
  ),
  CheckboxIndeterminate: () => (
    <StyledImage
      sx={CHECKBOX_SX}
      url="/images/icon-checkbox-intermediate.svg"
    />
  ),
};

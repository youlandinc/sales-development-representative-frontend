import { CircularProgress, Icon } from '@mui/material';

import { StyledImage } from '@/components/atoms';

import ICON_CLOSE from './assets/icon-close.svg';
import ICON_ARROW_SVG from './assets/icon-arrow.svg';
import ICON_ARROW_DOWN from './assets/icon-arrow-down.svg';

export const ARROW_ICON = (
  <Icon
    component={ICON_ARROW_SVG}
    sx={{ ml: 'auto', width: 16, height: 16, transform: 'rotate(-90deg)' }}
  />
);

export const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

export const buildPopupIcon = (isOpen: boolean) => (
  <Icon
    component={ICON_ARROW_DOWN}
    sx={{
      width: 14,
      height: 14,
      transform: isOpen ? 'rotate(0.5turn)' : 'none',
    }}
  />
);

export const LOADING_SPINNER = (
  <CircularProgress size="20px" sx={{ color: '#D0CEDA' }} />
);

const CHECKBOX_ICON_SX = { width: 20, height: 20, position: 'relative' };

export const CHECKBOX_CHECKED_ICON = (
  <StyledImage sx={CHECKBOX_ICON_SX} url="/images/icon-checkbox-check.svg" />
);

export const CHECKBOX_UNCHECKED_ICON = (
  <StyledImage sx={CHECKBOX_ICON_SX} url="/images/icon-checkbox-static.svg" />
);

export const CHECKBOX_INDETERMINATE_ICON = (
  <StyledImage
    sx={CHECKBOX_ICON_SX}
    url="/images/icon-checkbox-intermediate.svg"
  />
);

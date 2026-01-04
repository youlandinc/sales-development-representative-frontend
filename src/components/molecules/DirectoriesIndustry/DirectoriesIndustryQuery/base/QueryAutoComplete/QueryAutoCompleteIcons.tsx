import { CircularProgress, Icon } from '@mui/material';

import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_CLOSE from './assets/icon-close.svg';

export const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

export const POPUP_ICON = (
  <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
);

export const LOADING_SPINNER = (
  <CircularProgress size="20px" sx={{ color: '#D0CEDA' }} />
);

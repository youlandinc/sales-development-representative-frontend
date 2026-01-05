import { Icon, SvgIconProps } from '@mui/material';

// Shared icons
import ICON_TICK from './assets/icon-tick.svg';
import ICON_TRASH from './assets/icon-trash.svg';

// PanelColumns icons
import ICON_COLUMNS_ICON from './assets/icon-columns-icon.svg';
import ICON_COLUMNS_SEARCH from './assets/icon-columns-search.svg';

// PanelFilter icons
import ICON_FILTER_ICON from './assets/icon-filter-icon.svg';
import ICON_FILTER_ADD from './assets/icon-filter-add.svg';
import ICON_FILTER_ARROW from './assets/icon-filter-arrow.svg';
import ICON_FILTER_CLEAR from './assets/icon-filter-clear.svg';
import ICON_FILTER_COPY from './assets/icon-filter-copy.svg';
import ICON_FILTER_DOTS from './assets/icon-filter-dots.svg';

// PanelView icons
import ICON_VIEW_ICON from './assets/icon-view-icon.svg';
import ICON_VIEW_CONFIGED from './assets/icon-view-configed.svg';
import ICON_VIEW_DRAG from './assets/icon-view-drag.svg';
import ICON_VIEW_RENAME from './assets/icon-view-rename.svg';
import ICON_VIEW_DESCRIPTION from './assets/icon-view-description.svg';
import ICON_VIEW_DUPLICATE from './assets/icon-view-duplicate.svg';

type IconSize = 12 | 14 | 16 | 18 | 20;

interface PanelIconProps extends SvgIconProps {
  size?: IconSize | number;
}

export const PanelIcon = {
  // ========== PanelColumns ==========
  ColumnsIcon: ({ size = 20, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_COLUMNS_ICON}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ColumnsSearch: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_COLUMNS_SEARCH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // ========== PanelFilter ==========
  FilterIcon: ({ size = 20, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_ICON}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterAdd: ({ size = 12, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_ADD}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterArrow: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_ARROW}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterClear: ({ size = 18, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_CLEAR}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterCopy: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_COPY}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterDots: ({ size = 20, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_FILTER_DOTS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterTick: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_TICK}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FilterTrash: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_TRASH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // For FilterSelect IconComponent (needs raw SVG)
  FilterArrowRaw: ICON_FILTER_ARROW,

  // ========== PanelView ==========
  ViewIcon: ({ size = 20, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_ICON}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewConfiged: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_CONFIGED}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewSelected: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_TICK}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewDrag: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_DRAG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewRename: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_RENAME}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewDescription: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_DESCRIPTION}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewDuplicate: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_VIEW_DUPLICATE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ViewDelete: ({ size = 16, ...props }: PanelIconProps) => (
    <Icon
      component={ICON_TRASH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
};

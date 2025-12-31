import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { TableViewData, TableViewTypeEnum } from '@/types/enrichment';

import ICON_VIEW from './assets/icon-view.svg';
import ICON_VIEW_CONFIGED from './assets/icon-view-configed.svg';
import ICON_VIEW_SELECTED from './assets/icon-view-selected.svg';
import ICON_DRAG from './assets/icon-drag.svg';

export interface ViewItemProps {
  view: TableViewData;
  isActive: boolean;
  isDraggable?: boolean;
  onViewSelect: (viewId: string) => void;
}

export const ViewItem: FC<ViewItemProps> = ({
  view,
  isActive,
  isDraggable = false,
  onViewSelect,
}) => {
  const isGeneral = view.viewType === TableViewTypeEnum.general;
  const IconComponent = isGeneral ? ICON_VIEW : ICON_VIEW_CONFIGED;

  return (
    <Stack
      onClick={() => onViewSelect(view.viewId)}
      sx={{
        gap: 1,
        px: 1.5,
        py: 0.75,
        height: 32,
        alignItems: 'center',
        flexDirection: 'row',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#F4F5F9',
        },
      }}
    >
      {isDraggable && (
        <Icon
          component={ICON_DRAG}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            cursor: 'grab',
            '& path': {
              fill: '#363440',
            },
          }}
        />
      )}
      <Icon
        component={IconComponent}
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0,
          '& path': {
            fill: '#363440',
          },
        }}
      />
      <Typography
        sx={{
          flex: 1,
          fontSize: 14,
          color: '#363440',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {view.viewName}
      </Typography>
      {isActive && (
        <Icon
          component={ICON_VIEW_SELECTED}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
      )}
    </Stack>
  );
};

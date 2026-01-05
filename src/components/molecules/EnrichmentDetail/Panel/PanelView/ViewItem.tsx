import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { TableViewData, TableViewTypeEnum } from '@/types/enrichment';
import { PanelIcon } from '../PanelIcon';

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
        <PanelIcon.ViewDrag
          sx={{
            flexShrink: 0,
            cursor: 'grab',
            '& path': {
              fill: '#363440',
            },
          }}
        />
      )}
      {isGeneral ? (
        <PanelIcon.ViewIcon
          size={16}
          sx={{
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
      ) : (
        <PanelIcon.ViewConfiged
          sx={{
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
      )}
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
        <PanelIcon.ViewSelected
          sx={{
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

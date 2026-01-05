import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TableIcon, TypeIcon } from '../../Table';

import { TableColumnProps } from '@/types/enrichment';

export interface ColumnItemProps {
  column: TableColumnProps;
  onColumnNameClick: (fieldId: string) => void;
  onVisibilityToggle: (fieldId: string, visible: boolean) => void;
}

export const ColumnItem: FC<ColumnItemProps> = ({
  column,
  onColumnNameClick,
  onVisibilityToggle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.fieldId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      sx={{
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        height: 32,
        alignItems: 'center',
        flexDirection: 'row',
        cursor: 'grab',
        bgcolor: isDragging ? '#F4F5F9' : 'transparent',
        '&:hover': {
          bgcolor: '#F4F5F9',
          '& .action': {
            display: 'block',
          },
        },
      }}
      {...attributes}
      {...listeners}
    >
      <TypeIcon
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0,
          '& path': {
            fill: !column.visible ? '#B0ADBD' : '#2A292E',
          },
        }}
        type={column.fieldType}
      />
      <Typography
        onClick={() => onColumnNameClick(column.fieldId)}
        sx={{
          fontSize: 14,
          color: column.visible ? 'text.primary' : '#B0ADBD',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            textDecorationColor: 'rgba(111, 108, 125, .5)',
            textUnderlineOffset: '2px',
          },
        }}
      >
        {column.fieldName}
      </Typography>
      <Icon
        className="action"
        component={
          column.visible ? TableIcon.MenuVisibleRaw : TableIcon.MenuHideRaw
        }
        onClick={() => onVisibilityToggle(column.fieldId, !column.visible)}
        sx={{
          ml: 'auto',
          width: 14,
          height: 14,
          flexShrink: 0,
          display: !column.visible ? 'block' : 'none',
          cursor: 'pointer',
          '& path': {
            fill: !column.visible ? '#B0ADBD' : '#2A292E',
          },
        }}
      />
    </Stack>
  );
};

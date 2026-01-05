import { FC } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { ColumnItem } from './index';

import { TableColumnProps } from '@/types/enrichment';

export interface ColumnSectionProps {
  columns: TableColumnProps[];
  columnIds: string[];
  isSearching: boolean;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onColumnNameClick: (fieldId: string) => void;
  onVisibilityToggle: (fieldId: string, visible: boolean) => void;
}

export const ColumnSection: FC<ColumnSectionProps> = ({
  columns,
  columnIds,
  isSearching,
  sensors,
  onDragEnd,
  onColumnNameClick,
  onVisibilityToggle,
}) => {
  if (columns.length === 0) {
    return null;
  }

  return (
    <DndContext
      autoScroll={{
        threshold: {
          x: 0,
          y: 0.2,
        },
      }}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <SortableContext
        disabled={isSearching}
        items={columnIds}
        strategy={verticalListSortingStrategy}
      >
        {columns.map((col) => (
          <ColumnItem
            column={col}
            key={col.fieldId}
            onColumnNameClick={onColumnNameClick}
            onVisibilityToggle={onVisibilityToggle}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

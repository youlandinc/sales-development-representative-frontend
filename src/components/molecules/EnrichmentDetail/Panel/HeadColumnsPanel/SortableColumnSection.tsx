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

import { SortableColumnItem } from './index';

import { TableColumnProps } from '@/types/enrichment';

export interface SortableColumnSectionProps {
  columns: TableColumnProps[];
  columnIds: string[];
  isSearching: boolean;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onColumnNameClick: (fieldId: string) => void;
  onVisibilityToggle: (fieldId: string, visible: boolean) => void;
}

export const SortableColumnSection: FC<SortableColumnSectionProps> = ({
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
          <SortableColumnItem
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

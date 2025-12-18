import { ComponentProps, CSSProperties, FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { HeadCell } from './HeadCell';
import { TABLE_Z_INDEX } from '../styles';

export const useHeadCellSortable = (id: string, disabled = false) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const dragStyle: CSSProperties = {
    // Use Translate instead of Transform to avoid scale effect
    transform: CSS.Translate.toString(transform),
    transition,
    // When dragging: above normal headers but below pinned columns
    ...(isDragging && { zIndex: TABLE_Z_INDEX.HEADER_DRAGGING }),
  };

  return {
    dragRef: setNodeRef,
    dragStyle,
    dragListeners: listeners,
    dragAttributes: attributes,
    isDragging,
  };
};

interface SortableHeadCellProps extends ComponentProps<typeof HeadCell> {
  sortableId: string;
  sortableDisabled?: boolean;
}

export const SortableHeadCell: FC<SortableHeadCellProps> = ({
  sortableId,
  sortableDisabled = false,
  ...headCellProps
}) => {
  const { dragRef, dragStyle, dragListeners, dragAttributes, isDragging } =
    useHeadCellSortable(sortableId, sortableDisabled);

  return (
    <HeadCell
      {...headCellProps}
      dragAttributes={dragAttributes}
      dragListeners={dragListeners}
      dragStyle={dragStyle}
      isDragging={isDragging}
      ref={dragRef}
    />
  );
};

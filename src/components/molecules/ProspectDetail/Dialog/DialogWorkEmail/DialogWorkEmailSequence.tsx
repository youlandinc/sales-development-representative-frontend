import { Icon, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { StyledButton, StyledSwitch } from '@/components/atoms';
import { DialogWorkEmailCollapseCard } from './index';

import { useWorkEmailStore } from '@/stores/Prospect';

import ICON_DELETE from '../../assets/dialog/Icon_delete_default.svg';
import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';
import ICON_DRAG from '../../assets/dialog/icon_drag.svg';
import ICON_PLUS from '../../assets/dialog/icon_plus.svg';

const DragItem = ({ id }: { id: number }) => {
  const { setDialogIntegrationsVisible, setDisplayType } = useWorkEmailStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      gap={3}
      justifyContent={'space-between'}
      ref={setNodeRef}
      sx={{
        cursor: 'pointer',
        transform: CSS.Transform.toString(transform),
        transition,
        userSelect: 'none',
        bgcolor: '#FFF',
      }}
      {...listeners}
      {...attributes}
    >
      <Stack alignItems={'center'} flex={1} flexDirection={'row'} gap={0.5}>
        <Icon component={ICON_DRAG} sx={{ width: 18, height: 18 }} />
        <Stack
          alignItems={'center'}
          borderRadius={1}
          boxShadow={'0 0 2px 0 rgba(52, 50, 62, 0.35)'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={() => setDisplayType('integration')}
          px={1}
          py={0.5}
          sx={{
            '&:hover': {
              bgcolor: 'rgb(247 248 249 / 1)',
            },
          }}
        >
          <Typography variant={'body3'}>Drag to rearrange {id}</Typography>
          <Icon
            component={ICON_ARROW}
            sx={{
              width: 12,
              height: 12,
              transform: 'rotate(-90deg)',
            }}
          />
        </Stack>
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
        <StyledSwitch />
        <Icon component={ICON_DELETE} sx={{ width: 18, height: 18 }} />
      </Stack>
    </Stack>
  );
};

export const DialogWorkEmailSequence: FC = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const { setDialogIntegrationsVisible, setDisplayType } = useWorkEmailStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DialogWorkEmailCollapseCard title={'Waterfall sequence'}>
      <Stack gap={1.5}>
        <Typography variant={'subtitle2'}>Actions</Typography>
        <Typography variant={'body3'}>
          Drag these actions to rearrange the order. Toggling off a step skips
          it.
        </Typography>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((_, index) => (
              <DragItem id={index + 1} key={index} />
            ))}
          </SortableContext>
        </DndContext>
        <StyledButton
          color={'info'}
          onClick={() => {
            setDialogIntegrationsVisible(true);
          }}
          size={'small'}
          sx={{
            borderColor: '#E5E5E5 !important',
            fontWeight: 400,
            color: '#6F6C7D !important',
            gap: 0.5,
          }}
          variant={'outlined'}
        >
          <Icon component={ICON_PLUS} sx={{ width: 18, height: 18 }} /> Add
          action
        </StyledButton>
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};

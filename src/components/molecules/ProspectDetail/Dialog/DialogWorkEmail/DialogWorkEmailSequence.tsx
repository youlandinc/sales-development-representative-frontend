import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
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
import { Icon, Stack, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import { StyledButton, StyledCost, StyledSwitch } from '@/components/atoms';
import { DialogWorkEmailCollapseCard } from './index';

import { useWorkEmailStore } from '@/stores/Prospect';
import { useComputedInWorkEmailStore } from './hooks';

import { DisplayTypeEnum, IntegrationAction } from '@/types/Prospect';

import ICON_DELETE from '@/components/molecules/ProspectDetail/assets/dialog/Icon_delete_default.svg';
import ICON_VALIDATE from '@/components/molecules/ProspectDetail/assets/dialog/dialogWorkEmail/icon_validate_false.svg';
import ICON_ARROW from '@/components/molecules/ProspectDetail/assets/dialog/icon_arrow_down.svg';
import ICON_DRAG from '@/components/molecules/ProspectDetail/assets/dialog/icon_drag.svg';
import ICON_PLUS from '@/components/molecules/ProspectDetail/assets/dialog/icon_plus.svg';

interface DragItemProps {
  id: string;
  integrationInfo: IntegrationAction;
}

const DragItem: FC<DragItemProps> = ({ id, integrationInfo }) => {
  const {
    setDisplayType,
    setAllIntegrations,
    allIntegrations,
    setSelectedIntegrationToConfig,
  } = useWorkEmailStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

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
          onClick={(e) => {
            e.stopPropagation();
            setDisplayType(DisplayTypeEnum.integration);
            setSelectedIntegrationToConfig(integrationInfo);
          }}
          px={1}
          py={1}
          sx={{
            '&:hover': {
              bgcolor: 'rgb(247 248 249 / 1)',
            },
          }}
        >
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Image
              alt={integrationInfo.integrationName}
              height={20}
              src={integrationInfo.logoUrl}
              width={20}
            />
            <Typography variant={'body2'}>
              {integrationInfo.integrationName}
            </Typography>
          </Stack>
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            {integrationInfo.isMissingRequired ? (
              <Tooltip arrow placement="top" title={'Missing required inputs'}>
                <Icon
                  component={ICON_VALIDATE}
                  sx={{ width: 18, height: 18 }}
                />
              </Tooltip>
            ) : (
              <StyledCost
                border={'1px solid #D0CEDA'}
                borderRadius={5}
                count={integrationInfo.score}
                py={'2px'}
              />
            )}
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
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
        <StyledSwitch
          checked={!integrationInfo.skipped}
          onChange={(e) => {
            setAllIntegrations(
              allIntegrations.map((i) =>
                i.actionKey === integrationInfo.actionKey
                  ? { ...i, skipped: !e.target.checked }
                  : i,
              ),
            );
          }}
        />
        <Icon
          component={ICON_DELETE}
          onClick={() => {
            setAllIntegrations(
              allIntegrations.map((i) =>
                i.actionKey === integrationInfo.actionKey
                  ? { ...i, isDefault: false }
                  : i,
              ),
            );
          }}
          sx={{ width: 20, height: 20, '& path': { fill: '#DE6449' } }}
        />
      </Stack>
    </Stack>
  );
};

export const DialogWorkEmailSequence: FC = () => {
  const {
    setDialogIntegrationsVisible,
    allIntegrations,
    updateIntegrationsOrder,
  } = useWorkEmailStore();
  const { integrationsInWaterfall } = useComputedInWorkEmailStore();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = integrationsInWaterfall.findIndex(
        (i) => i.actionKey === active.id,
      );
      const newIndex = integrationsInWaterfall.findIndex(
        (i) => i.actionKey === over?.id,
      );
      const newItems = arrayMove(integrationsInWaterfall, oldIndex, newIndex);
      // setItems(newItems);
      updateIntegrationsOrder(newItems);
    }
  };

  // useEffect(() => {
  //   setItems(integrationsInWaterfall);
  // }, [JSON.parse(JSON.stringify(integrationsInWaterfall))]);

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
          <SortableContext
            items={integrationsInWaterfall.map((i) => i.actionKey)}
            strategy={verticalListSortingStrategy}
          >
            {integrationsInWaterfall.map((i) => (
              <DragItem
                id={i.actionKey}
                integrationInfo={i}
                key={i.actionKey}
              />
            ))}
          </SortableContext>
        </DndContext>
        <StyledButton
          color={'info'}
          disabled={
            allIntegrations.length ===
            allIntegrations.filter((i) => i.isDefault).length
          }
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
          <Icon
            component={ICON_PLUS}
            sx={{ width: 18, height: 18, '& path': { fill: 'currentColor' } }}
          />{' '}
          Add action
        </StyledButton>
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};

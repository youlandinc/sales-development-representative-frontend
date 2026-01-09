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
import { Stack, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton, StyledCost, StyledSwitch } from '@/components/atoms';
import { WorkEmailCollapseCard } from './index';

import { useWorkEmailStore } from '@/stores/enrichment';
import { useComputedInWorkEmailStore } from './hooks';

import { DisplayTypeEnum, IntegrationAction } from '@/types/enrichment';

import { DrawersIconConfig } from '../DrawersIconConfig';

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
  } = useWorkEmailStore(
    useShallow((state) => ({
      setDisplayType: state.setDisplayType,
      setAllIntegrations: state.setAllIntegrations,
      allIntegrations: state.allIntegrations,
      setSelectedIntegrationToConfig: state.setSelectedIntegrationToConfig,
    })),
  );
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
        <DrawersIconConfig.Drag size={18} />
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
              <Tooltip
                arrow
                placement={'top'}
                title={'Missing required inputs'}
              >
                <DrawersIconConfig.FindValidateFalse size={18} />
              </Tooltip>
            ) : (
              <StyledCost
                border={'1px solid #D0CEDA'}
                borderRadius={5}
                count={integrationInfo.score}
                py={'2px'}
              />
            )}
            <DrawersIconConfig.ArrowDown
              size={12}
              sx={{
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
              allIntegrations.map((i: IntegrationAction) =>
                i.actionKey === integrationInfo.actionKey
                  ? { ...i, skipped: !e.target.checked }
                  : i,
              ),
            );
          }}
        />
        <DrawersIconConfig.DeleteDefault
          onClick={() => {
            setAllIntegrations(
              allIntegrations.map((i: IntegrationAction) =>
                i.actionKey === integrationInfo.actionKey
                  ? { ...i, isDefault: false }
                  : i,
              ),
            );
          }}
          size={18}
          sx={{ width: 20, height: 20, '& path': { fill: '#DE6449' } }}
        />
      </Stack>
    </Stack>
  );
};

export const WorkEmailSequence: FC = () => {
  const {
    setDialogIntegrationsVisible,
    allIntegrations,
    updateIntegrationsOrder,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setDialogIntegrationsVisible: state.setDialogIntegrationsVisible,
      allIntegrations: state.allIntegrations,
      updateIntegrationsOrder: state.updateIntegrationsOrder,
    })),
  );
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
    <WorkEmailCollapseCard title={'Waterfall sequence'}>
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
          <DrawersIconConfig.Plus
            size={18}
            sx={{ '& path': { fill: 'currentColor' } }}
          />{' '}
          {'Add action'}
        </StyledButton>
      </Stack>
    </WorkEmailCollapseCard>
  );
};

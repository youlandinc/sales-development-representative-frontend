import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
import { FC } from 'react';

import { StyledSelect } from '@/components/atoms';
import { DialogHeader } from '../Common';
import {
  WorkEmailCollapseCard,
  WorkEmailIntegrationAccountFooter,
  WorkEmailIntegrationColumnMapping,
} from './index';

import { DisplayTypeEnum, SourceOfOpenEnum } from '@/types/enrichment';

import {
  ActiveTypeEnum,
  IntegrationTypeEnum,
  useActionsStore,
  useEnrichmentTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';

import { DrawersIconConfig } from '../DrawersIconConfig';

interface WorkEmailIntegrationAccountProps {
  cb?: () => void;
}

export const WorkEmailIntegrationAccount: FC<
  WorkEmailIntegrationAccountProps
> = ({ cb }) => {
  const {
    selectedIntegrationToConfig,
    setDisplayType,
    activeType,
    integrationType,
  } = useWorkEmailStore(
    useShallow((store) => ({
      selectedIntegrationToConfig: store.selectedIntegrationToConfig,
      setDisplayType: store.setDisplayType,
      activeType: store.activeType,
      integrationType: store.integrationType,
    })),
  );
  const closeDialog = useEnrichmentTableStore((state) => state.closeDialog);
  const { sourceOfOpen, setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((store) => ({
      sourceOfOpen: store.sourceOfOpen,
      setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
    })),
  );

  const onClickBack = () => {
    if (
      sourceOfOpen === SourceOfOpenEnum.dialog &&
      integrationType === IntegrationTypeEnum.singleIntegrated
    ) {
      setDialogAllEnrichmentsVisible(true);
      setDisplayType(DisplayTypeEnum.main);
      closeDialog();
    } else {
      setDisplayType(DisplayTypeEnum.main);
    }
  };

  //只有edit，singleIntegrated时隐藏按钮
  const showBackButton = !(
    activeType === ActiveTypeEnum.edit &&
    integrationType === IntegrationTypeEnum.singleIntegrated
  );

  return (
    <Stack flex={1} overflow={'hidden'}>
      <DialogHeader
        handleBack={onClickBack}
        handleClose={() => {
          closeDialog();
        }}
        showBackButton={showBackButton}
        title={selectedIntegrationToConfig?.name}
      />
      <Stack flex={1} gap={3} minHeight={0} overflow={'auto'} p={3}>
        {/* <Stack gap={1}>
          <Typography fontWeight={600}>Waterfall output</Typography>
          <Typography variant={'body2'}>
            Choose what to output to your table from this waterfall
          </Typography>
          <WorkEmailCustomSelect />
        </Stack> */}
        <Stack gap={1}>
          <Typography fontWeight={600}>Action</Typography>
          <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
            <Image
              alt={selectedIntegrationToConfig?.integrationName || ''}
              height={18}
              src={selectedIntegrationToConfig?.logoUrl || ''}
              width={18}
            />
            <Typography color={'text.secondary'} variant={'body3'}>
              {selectedIntegrationToConfig?.integrationName || ''}
            </Typography>
            <DrawersIconConfig.ArrowDown
              size={14}
              sx={{
                transform: 'rotate(-90deg)',
                '& path': { fill: '#6F6C7D' },
              }}
            />
            <Typography variant={'body3'}>
              {selectedIntegrationToConfig?.name || ''}
            </Typography>
          </Stack>
          <Typography variant={'body3'}>
            {selectedIntegrationToConfig?.description || ''}
          </Typography>
        </Stack>
        <Typography variant={'body3'}>
          We automatically try to map the correct columns for you. If any inputs
          are empty, just select the columns you want to map. Once all inputs
          are filled, you&apos;re ready to save and run!
        </Typography>
        <WorkEmailCollapseCard title={'Account'}>
          <Stack gap={1.5}>
            <Typography variant={'body3'}>
              Select {selectedIntegrationToConfig?.integrationName || ''}{' '}
              account
            </Typography>
            <StyledSelect
              options={[
                {
                  value: `${selectedIntegrationToConfig?.authAccountId || ''}`,
                  label: `Corepass-managed-${selectedIntegrationToConfig?.name || ''} account`,
                  key: `${selectedIntegrationToConfig?.authAccountId || ''}`,
                },
              ]}
              value={selectedIntegrationToConfig?.authAccountId || ''}
            />
          </Stack>
        </WorkEmailCollapseCard>
        <WorkEmailIntegrationColumnMapping />
      </Stack>
      <WorkEmailIntegrationAccountFooter cb={cb} />
    </Stack>
  );
};

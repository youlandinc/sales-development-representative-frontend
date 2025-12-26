import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';

import { StyledSelect } from '@/components/atoms';
import { DialogHeader } from '../Common';
import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailIntegrationColumnMapping,
} from './index';

import { DisplayTypeEnum, SourceOfOpenEnum } from '@/types/enrichment';

import {
  useActionsStore,
  useProspectTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailIntegrationAccount = () => {
  const { selectedIntegrationToConfig, setDisplayType } = useWorkEmailStore(
    useShallow((store) => ({
      selectedIntegrationToConfig: store.selectedIntegrationToConfig,
      setDisplayType: store.setDisplayType,
    })),
  );
  const closeDialog = useProspectTableStore((state) => state.closeDialog);
  const { sourceOfOpen, setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((store) => ({
      sourceOfOpen: store.sourceOfOpen,
      setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
    })),
  );

  const onClickBack = () => {
    if (sourceOfOpen === SourceOfOpenEnum.dialog) {
      setDialogAllEnrichmentsVisible(true);
      closeDialog();
    } else {
      setDisplayType(DisplayTypeEnum.main);
    }
  };

  return (
    <Stack flex={1} overflow={'hidden'}>
      <DialogHeader
        handleBack={onClickBack}
        handleClose={() => {
          closeDialog();
        }}
        title={selectedIntegrationToConfig?.name}
      />
      <Stack flex={1} gap={3} minHeight={0} overflow={'auto'} p={3}>
        {/* <Stack gap={1}>
          <Typography fontWeight={600}>Waterfall output</Typography>
          <Typography variant={'body2'}>
            Choose what to output to your table from this waterfall
          </Typography>
          <DialogWorkEmailCustomSelect />
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
            <Icon
              component={ICON_ARROW}
              sx={{
                width: 14,
                height: 14,
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
        <DialogWorkEmailCollapseCard title={'Account'}>
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
        </DialogWorkEmailCollapseCard>
        <DialogWorkEmailIntegrationColumnMapping />
      </Stack>
    </Stack>
  );
};

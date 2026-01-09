import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { DialogHeader } from '../Common';
import {
  WorkEmailFooter,
  WorkEmailFullConfiguration,
  WorkEmailQuickSetup,
} from './index';

import {
  useEnrichmentTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { SourceOfOpenEnum, WaterfallConfigTypeEnum } from '@/types/enrichment';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface WorkEmailMainProps {
  cb?: () => void;
}

export const WorkEmailMain: FC<WorkEmailMainProps> = ({ cb }) => {
  const {
    allIntegrations,
    setWaterfallConfigType,
    waterfallConfigType,
    dialogHeaderName,
    waterfallDescription,
  } = useWorkEmailStore(
    useShallow((store) => ({
      allIntegrations: store.allIntegrations,
      setWaterfallConfigType: store.setWaterfallConfigType,
      waterfallConfigType: store.waterfallConfigType,
      dialogHeaderName: store.dialogHeaderName,
      waterfallDescription: store.waterfallDescription,
    })),
  );
  const { openDialog, closeDialog } = useEnrichmentTableStore(
    useShallow((state) => ({
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
    })),
  );
  const { sourceOfOpen, setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((state) => ({
      sourceOfOpen: state.sourceOfOpen,
      setDialogAllEnrichmentsVisible: state.setDialogAllEnrichmentsVisible,
    })),
  );

  const onClickToClose = () => {
    closeDialog();
    setWaterfallConfigType(WaterfallConfigTypeEnum.setup);
  };

  const onClickToBack = () => {
    if (sourceOfOpen === SourceOfOpenEnum.dialog) {
      closeDialog();
      setDialogAllEnrichmentsVisible(true);
    } else {
      openDialog(TableColumnMenuActionEnum.actions_overview);
    }
  };
  const hasDefaultIntegrations =
    allIntegrations.filter((i) => i.isDefault).length > 0;

  return (
    <Stack flex={1} overflow={'hidden'}>
      <DialogHeader
        handleBack={onClickToBack}
        handleClose={onClickToClose}
        title={dialogHeaderName}
      />
      <Stack flex={1} gap={4} minHeight={0} overflow={'auto'} p={3}>
        <Stack gap={1}>
          <Typography fontWeight={600} lineHeight={1.2}>
            Action
          </Typography>
          <Typography fontWeight={600} lineHeight={1.2} variant={'body2'}>
            Waterfall
          </Typography>
          <Typography variant={'body2'}>{waterfallDescription}</Typography>
        </Stack>

        <Stack gap={3}>
          {hasDefaultIntegrations && (
            <ToggleButtonGroup
              color={'primary'}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setWaterfallConfigType(value);
                }
              }}
              sx={{
                '& .Mui-selected': {
                  borderColor: 'primary.main',
                },
              }}
              translate={'no'}
              value={waterfallConfigType}
            >
              <ToggleButton
                fullWidth
                sx={{
                  fontSize: 14,
                  textTransform: 'none',
                  lineHeight: 1.2,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: '8px 0 0 8px',
                }}
                value={WaterfallConfigTypeEnum.setup}
              >
                Quick setup
              </ToggleButton>
              <ToggleButton
                fullWidth
                sx={{
                  fontSize: 14,
                  textTransform: 'none',
                  lineHeight: 1.2,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: '0 8px 8px 0',
                }}
                value={WaterfallConfigTypeEnum.configure}
              >
                Full configuration
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          {waterfallConfigType === 'setup' && <WorkEmailQuickSetup />}
          {waterfallConfigType === 'configure' && (
            <WorkEmailFullConfiguration />
          )}
        </Stack>
      </Stack>
      <WorkEmailFooter cb={cb} />
    </Stack>
  );
};

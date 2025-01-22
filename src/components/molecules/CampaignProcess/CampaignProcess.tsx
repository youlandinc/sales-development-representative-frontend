import { useDialogStore } from '@/stores/useDialogStore';

import { StyledDialog } from '@/components/atoms';

import { CampaignProcessContent, CampaignProcessHeader } from './index';

export const CampaignProcess = () => {
  const { visibleProcess, closeProcess, activeStep, resetDialogState } =
    useDialogStore();

  return (
    <StyledDialog
      content={<CampaignProcessContent />}
      fullScreen={activeStep !== 1}
      header={<CampaignProcessHeader />}
      headerSx={{ p: '0' }}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') {
          closeProcess();
          resetDialogState();
        }
      }}
      open={visibleProcess}
      paperWidth={1200}
    />
  );
};

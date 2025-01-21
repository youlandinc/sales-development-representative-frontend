import { useDialogStore } from '@/stores/useDialogStore';

import { StyledDialog } from '@/components/atoms';

import { CampaignProcessContent, CampaignProcessHeader } from './index';

export const CampaignProcess = () => {
  const { visible, close, activeStep, resetDialogState } = useDialogStore();

  return (
    <StyledDialog
      content={<CampaignProcessContent />}
      fullScreen={activeStep !== 1}
      header={<CampaignProcessHeader />}
      onClose={() => {
        close();
        resetDialogState();
      }}
      open={visible}
      paperWidth={1200}
    />
  );
};

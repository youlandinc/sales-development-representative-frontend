import { useDialogStore } from '@/stores/useDialogStore';

import { StyledDialog } from '@/components/atoms';

import { CampaignProcessContent, CampaignProcessHeader } from './index';

export const CampaignProcess = () => {
  const { visible, close, activeStep } = useDialogStore();

  return (
    <StyledDialog
      content={<CampaignProcessContent />}
      fullScreen={activeStep !== 1}
      header={<CampaignProcessHeader />}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') {
          close();
        }
      }}
      open={visible}
      paperWidth={1200}
    />
  );
};

import { useMemo } from 'react';
import { useDialogStore } from '@/stores/useDialogStore';
import { CampaignStepEnum } from '@/types';

import { StyledDialog } from '@/components/atoms';

import { CampaignProcessContent, CampaignProcessHeader } from './index';

export const CampaignProcess = () => {
  const { visibleProcess, closeProcessAndReset, activeStep } = useDialogStore();

  const fullScreen = useMemo(
    () =>
      ![
        CampaignStepEnum.prepare,
        CampaignStepEnum.choose,
        CampaignStepEnum.audience,
      ].includes(activeStep),
    [activeStep],
  );

  const isNonFullScreenStep = !fullScreen;

  const paperWidth = useMemo(() => {
    if (activeStep === CampaignStepEnum.audience) {
      return 900;
    }
    if (
      [CampaignStepEnum.choose, CampaignStepEnum.prepare].includes(activeStep)
    ) {
      return 1152;
    }
    return 1200;
  }, [activeStep]);

  return (
    <StyledDialog
      content={<CampaignProcessContent />}
      fullScreen={fullScreen}
      header={<CampaignProcessHeader />}
      headerSx={{ p: 0 }}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') {
          closeProcessAndReset();
        }
      }}
      open={visibleProcess}
      paperWidth={paperWidth}
      slotProps={{
        transition: {
          timeout: 300,
          easing: 'ease-in-out',
        },
      }}
      sx={{
        '&.MuiDialog-root': {
          '& .MuiPaper-root': {
            borderRadius: isNonFullScreenStep ? 4 : 0,
            transition: 'all 0.3s ease-in-out !important',
          },
        },
      }}
    />
  );
};

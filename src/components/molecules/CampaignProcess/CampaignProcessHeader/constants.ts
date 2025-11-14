import { CampaignStepEnum, SetupPhaseEnum } from '@/types';

export const BUTTON_GROUP = [
  {
    id: CampaignStepEnum.audience,
    label: 'Audience',
    order: 1,
    setupPhase: SetupPhaseEnum.audience,
  },
  {
    id: CampaignStepEnum.messaging,
    label: 'Messaging',
    order: 2,
    setupPhase: SetupPhaseEnum.messaging,
  },
  {
    id: CampaignStepEnum.launch,
    label: 'Launch',
    order: 3,
    setupPhase: SetupPhaseEnum.launch,
  },
];

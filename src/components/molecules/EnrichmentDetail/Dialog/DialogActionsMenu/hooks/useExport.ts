import ICON_CSV from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_csv.svg';
import ICON_CALL from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_call.svg';
import ICON_CAMPAIGN from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_campaign.svg';
import { useDialogStore } from '@/stores/useDialogStore';
import { useShallow } from 'zustand/shallow';
import { ProcessCreateTypeEnum } from '@/types';

export const useExport = () => {
  const { openProcess, setCampaignType } = useDialogStore(
    useShallow((state) => ({
      openProcess: state.openProcess,
      setCampaignType: state.setCampaignType,
    })),
  );

  const EXPORTS_MENUS = [
    {
      icon: ICON_CSV,
      title: 'Download CSV',
      description:
        'Provide a short summary of what the company does, who it serves, and what products/services it offers.',
      onClick: async () => {},
    },
    {
      icon: ICON_CAMPAIGN,
      title: 'Email campaign',
      description:
        'Provide a short summary of what the company does, who it serves, and what products/services it offers.',
      onClick: async () => {
        setCampaignType(ProcessCreateTypeEnum.ai_table);
        await openProcess('FROM_TABLE');
      },
    },
    // {
    //   icon: ICON_CALL,
    //   title: 'Call campaign',
    //   description:
    //     'Provide a short summary of what the company does, who it serves, and what products/services it offers.',
    // },
  ];

  return {
    EXPORTS_MENUS,
  };
};

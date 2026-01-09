import { DrawersIconConfig } from '../../DrawersIconConfig';
import { useDialogStore } from '@/stores/useDialogStore';
import { useShallow } from 'zustand/react/shallow';
import { ProcessCreateTypeEnum } from '@/types';
import { useSwitch } from '@/hooks';

export const useExport = () => {
  const { openProcess, setCampaignType } = useDialogStore(
    useShallow((state) => ({
      openProcess: state.openProcess,
      setCampaignType: state.setCampaignType,
    })),
  );

  const { visible, open, close } = useSwitch();

  const EXPORTS_MENUS = [
    {
      icon: DrawersIconConfig.ActionMenuCsv,
      title: 'Download CSV',
      description:
        'Provide a short summary of what the company does, who it serves, and what products/services it offers.',
      onClick: open,
    },
    {
      icon: DrawersIconConfig.ActionMenuCampaign,
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
    visible,
    open,
    close,
  };
};

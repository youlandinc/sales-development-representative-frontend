import { Icon, Stack } from '@mui/material';
import { FC, memo } from 'react';
import { useShallow } from 'zustand/shallow';

import { SDRToast } from '@/components/atoms';
import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Dialog/Common';
import { DialogExportInProgress } from './DialogExportInProgress';

import { useDialogStore } from '@/stores/useDialogStore';
import { useAsyncFn, useSwitch } from '@/hooks';

import { ProcessCreateTypeEnum } from '@/types';
import { HttpError } from '@/types';

import { createFile } from '@/utils/UnknowHandler';

import ICON_CSV from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_csv.svg';
import ICON_CALL from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_call.svg';
import ICON_CAMPAIGN from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_campaign.svg';
import { _exportTableData } from '@/request';
interface ExportsContentProps {
  tableId: string;
}

export const ExportsContent: FC<ExportsContentProps> = memo(({ tableId }) => {
  const { openProcess, setCampaignType } = useDialogStore(
    useShallow((state) => ({
      openProcess: state.openProcess,
      setCampaignType: state.setCampaignType,
    })),
  );

  const { visible, open, close } = useSwitch();

  const [state, downloadCsv] = useAsyncFn(async () => {
    try {
      await _exportTableData(tableId).then((res) => {
        const fileName = res.headers['content-disposition']
          .split(';')[1]
          .split('filename=')[1];
        const blob = new Blob([res.data], {
          type: 'text/csv;charset=UTF-8',
        });
        createFile(blob, fileName);
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [tableId]);

  const EXPORTS_MENUS = [
    {
      icon: ICON_CSV,
      title: 'Download CSV',
      description:
        'Provide a short summary of what the company does, who it serves, and what products/services it offers.',
      onClick: () => {
        open();
        // await downloadCsv();
      },
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
  return (
    <Stack gap={1.5}>
      {EXPORTS_MENUS.map((item, index) => (
        <StyledActionItem
          description={item.description}
          icon={<Icon component={item.icon} sx={{ width: 16, height: 16 }} />}
          key={`export-${index}`}
          onClick={item.onClick}
          title={item.title}
        />
      ))}
      <DialogExportInProgress
        onClose={close}
        open={visible}
        tableId={tableId}
      />
    </Stack>
  );
});

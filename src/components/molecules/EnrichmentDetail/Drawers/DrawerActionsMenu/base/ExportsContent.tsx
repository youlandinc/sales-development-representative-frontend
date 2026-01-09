import { Stack } from '@mui/material';
import { FC, memo } from 'react';

import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Drawers/Common';
import { DialogExportInProgress } from './DialogExportInProgress';

import { useExport } from '../hooks';
interface ExportsContentProps {
  tableId: string;
}

export const ExportsContent: FC<ExportsContentProps> = memo(({ tableId }) => {
  const { visible, close, EXPORTS_MENUS } = useExport();

  return (
    <Stack gap={1.5}>
      {EXPORTS_MENUS.map((item, index) => (
        <StyledActionItem
          description={item.description}
          icon={<item.icon size={16} />}
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

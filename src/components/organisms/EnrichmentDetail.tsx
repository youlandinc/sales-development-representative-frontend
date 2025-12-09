import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import {
  DialogActionsMenu,
  DialogWorkEmail,
  EnrichmentDetailContent,
  EnrichmentDetailHeader,
} from '@/components/molecules';
import { useProspectTable } from '../molecules/EnrichmentDetail/hooks';

export const EnrichmentDetail = () => {
  const params = useParams();
  const tableId = typeof params.tableId === 'string' ? params.tableId : '';
  const { onInitializeAiColumns } = useProspectTable({ tableId });
  return (
    <Stack
      sx={{
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EnrichmentDetailHeader tableId={tableId} />
      <EnrichmentDetailContent tableId={tableId} />
    </Stack>
  );
};

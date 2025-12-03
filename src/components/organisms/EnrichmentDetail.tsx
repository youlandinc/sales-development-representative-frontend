import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import {
  EnrichmentDetailContent,
  EnrichmentDetailHeader,
} from '@/components/molecules';

export const EnrichmentDetail = () => {
  const params = useParams();
  const tableId = typeof params.tableId === 'string' ? params.tableId : '';

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

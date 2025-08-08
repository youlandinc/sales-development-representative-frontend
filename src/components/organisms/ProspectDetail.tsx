import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import {
  ProspectDetailContent,
  ProspectDetailHeader,
} from '@/components/molecules';

export const ProspectDetail = () => {
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
      <ProspectDetailHeader tableId={tableId} />
      <ProspectDetailContent tableId={tableId} />
    </Stack>
  );
};

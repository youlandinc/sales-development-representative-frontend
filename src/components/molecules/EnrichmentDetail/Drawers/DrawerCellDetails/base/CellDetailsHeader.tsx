import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';

import { DrawersIconConfig } from '../../DrawersIconConfig';

export const CellDetailsHeader: FC = () => {
  const { closeDialog } = useEnrichmentTableStore(
    useShallow((store) => ({
      closeDialog: store.closeDialog,
    })),
  );
  return (
    <Stack alignItems={'center'} flexDirection={'row'} p={3} width={500}>
      <DrawersIconConfig.ActionMenuLighting
        size={20}
        sx={{
          mr: 0.5,
          '& path': { fill: '#363440' },
        }}
      />
      <Typography fontWeight={600} lineHeight={1.2} mr={1}>
        Cell details
      </Typography>
      <DrawersIconConfig.Close
        onClick={closeDialog}
        size={24}
        sx={{ ml: 'auto', cursor: 'pointer' }}
      />
    </Stack>
  );
};

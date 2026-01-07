import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';

import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';

export const DialogCellDetailsHeader: FC = () => {
  const { closeDialog } = useEnrichmentTableStore(
    useShallow((store) => ({
      closeDialog: store.closeDialog,
    })),
  );
  return (
    <Stack alignItems={'center'} flexDirection={'row'} p={3} width={500}>
      <Icon
        component={ICON_SPARK}
        sx={{
          width: 20,
          height: 20,
          mr: 0.5,
          '& path': { fill: '#363440' },
        }}
      />
      <Typography fontWeight={600} lineHeight={1.2} mr={1}>
        Cell details
      </Typography>
      <Icon
        component={ICON_CLOSE}
        onClick={closeDialog}
        sx={{ width: 24, height: 24, ml: 'auto', cursor: 'pointer' }}
      />
    </Stack>
  );
};

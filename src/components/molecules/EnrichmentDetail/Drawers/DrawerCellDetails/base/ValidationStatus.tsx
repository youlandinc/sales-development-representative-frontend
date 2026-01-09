import { FC, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { TableCellMetaDataValidateStatusEnum } from '@/types/enrichment/table';
import { DrawersIconConfig } from '@/components/molecules/EnrichmentDetail/Drawers';

interface ValidationStatusProps {
  status: TableCellMetaDataValidateStatusEnum;
}

const statusVisualMap: Record<
  TableCellMetaDataValidateStatusEnum,
  { label: string; icon: ReactNode }
> = {
  [TableCellMetaDataValidateStatusEnum.verified]: {
    label: 'Verified',
    icon: <DrawersIconConfig.ThinkingSuccess size={20} />,
  },
  [TableCellMetaDataValidateStatusEnum.potential_issue]: {
    label: 'Potential Issue',
    icon: <DrawersIconConfig.ThinkingWarning size={20} />,
  },
  [TableCellMetaDataValidateStatusEnum.not_validated]: {
    label: 'Not Validated',
    icon: <DrawersIconConfig.ThinkingNormal size={20} />,
  },
  [TableCellMetaDataValidateStatusEnum.not_found]: {
    label: 'Not Found',
    icon: <DrawersIconConfig.ThinkingError size={20} />,
  },
};

export const ValidationStatus: FC<ValidationStatusProps> = ({ status }) => {
  const statusVisual =
    statusVisualMap[status] ||
    statusVisualMap[TableCellMetaDataValidateStatusEnum.not_validated];
  return (
    <Stack alignItems={'center'} direction={'row'} gap={0.5}>
      {statusVisual.icon}
      <Typography color={'text.secondary'} variant={'body2'}>
        {statusVisual.label}
      </Typography>
    </Stack>
  );
};

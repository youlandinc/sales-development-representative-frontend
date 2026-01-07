import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { TableCellDetailValidateStatusEnum } from '@/types/enum';

import ICON_ERROR from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_error.svg';
import ICON_NORMAL from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_normal.svg';
import ICON_SUCCESS from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_success.svg';
import ICON_WARNING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_warning.svg';

interface ValidationStatusProps {
  status: TableCellDetailValidateStatusEnum;
}

const statusVisualMap: Record<
  TableCellDetailValidateStatusEnum,
  { label: string; icon: typeof ICON_SUCCESS }
> = {
  [TableCellDetailValidateStatusEnum.verified]: {
    label: 'Verified',
    icon: ICON_SUCCESS,
  },
  [TableCellDetailValidateStatusEnum.potentialIssue]: {
    label: 'Potential Issue',
    icon: ICON_WARNING,
  },
  [TableCellDetailValidateStatusEnum.notValidated]: {
    label: 'Not Validated',
    icon: ICON_NORMAL,
  },
  [TableCellDetailValidateStatusEnum.notFound]: {
    label: 'Not Found',
    icon: ICON_ERROR,
  },
};

export const ValidationStatus: FC<ValidationStatusProps> = ({ status }) => {
  const statusVisual =
    statusVisualMap[status] ||
    statusVisualMap[TableCellDetailValidateStatusEnum.notValidated];
  return (
    <Stack alignItems={'center'} direction={'row'} gap={0.5}>
      <Icon component={statusVisual.icon} sx={{ width: 20, height: 20 }} />
      <Typography color={'text.secondary'} variant={'body2'}>
        {statusVisual.label}
      </Typography>
    </Stack>
  );
};

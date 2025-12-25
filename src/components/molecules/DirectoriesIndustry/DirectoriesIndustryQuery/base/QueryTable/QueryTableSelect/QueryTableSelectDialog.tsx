import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog, StyledLoading } from '@/components/atoms';
import { ResponseEnrichmentTableViaSearch } from '@/types';
import { QueryTableSelectItem } from './index';

import ICON_CLOSE from './assets/icon-close.svg';

interface QueryTableSelectDialogProps {
  visible: boolean;
  fetchingTable: boolean;
  fetchingKeywords: boolean;
  selectedTableId: string;
  expandedIds: Set<string>;
  tableList: ResponseEnrichmentTableViaSearch;
  onClose: () => void;
  onToggleExpand: (tableId: string) => void;
  onSelectTable: (tableId: string) => void;
  onConfirm: () => void;
  dialogTitle?: string;
  buttonText?: string;
}

export const QueryTableSelectDialog: FC<QueryTableSelectDialogProps> = ({
  visible,
  fetchingTable,
  fetchingKeywords,
  selectedTableId,
  expandedIds,
  tableList,
  onClose,
  onToggleExpand,
  onSelectTable,
  onConfirm,
  dialogTitle = 'Select table',
  buttonText = 'Select table',
}) => {
  const isEmptyOrLoading = fetchingTable || tableList.length === 0;
  const contentSx = isEmptyOrLoading
    ? {
        height: 600,
        overflow: 'auto' as const,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    : { height: 600, overflow: 'auto' as const };

  return (
    <StyledDialog
      content={
        fetchingTable ? (
          <StyledLoading size={36} />
        ) : tableList.length === 0 ? (
          <Typography color="text.secondary" fontSize={14}>
            You don&apos;t have any table yet.
          </Typography>
        ) : (
          <Stack sx={{ gap: 0.5 }}>
            {tableList.map((item) => (
              <QueryTableSelectItem
                isExpanded={expandedIds.has(item.tableId)}
                item={item}
                key={item.tableId}
                onSelectTable={onSelectTable}
                onToggleExpand={onToggleExpand}
                selectedTableId={selectedTableId}
              />
            ))}
          </Stack>
        )
      }
      contentSx={contentSx}
      footer={
        <StyledButton
          disabled={!selectedTableId || fetchingKeywords}
          onClick={onConfirm}
          size="medium"
          sx={{ width: 104 }}
        >
          {buttonText}
        </StyledButton>
      }
      footerSx={{ pt: 3 }}
      header={
        <Stack
          sx={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>
            {dialogTitle}
          </Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={onClose}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      headerSx={{ pb: 3 }}
      onClose={onClose}
      open={visible}
    />
  );
};

import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog, StyledLoading } from '@/components/atoms';
import { StyledTableSelectItem } from './StyledTableSelectItem';
import { ResponseProspectTableViaSearch } from '@/types';

import ICON_CLOSE from './assets/icon-close.svg';

import {
  closeIconLargeSx,
  CONSTANTS,
  dialogStyles,
  dialogTitleSx,
  selectButtonSx,
} from './StyledTableSelect.styles';

interface FilterTableSelectDialogProps {
  visible: boolean;
  fetchingTable: boolean;
  fetchingCondition: boolean;
  selectedTableId: string;
  expandedIds: Set<string>;
  tableList: ResponseProspectTableViaSearch;
  onClose: () => void;
  onToggleExpand: (tableId: string) => void;
  onSelectTable: (tableId: string) => void;
  onConfirm: () => void;
}

export const StyledTableSelectDialog: FC<FilterTableSelectDialogProps> = ({
  visible,
  fetchingTable,
  fetchingCondition,
  selectedTableId,
  expandedIds,
  tableList,
  onClose,
  onToggleExpand,
  onSelectTable,
  onConfirm,
}) => {
  const contentSx = fetchingTable
    ? dialogStyles.loadingContentSx
    : tableList.length === 0
      ? dialogStyles.emptyContentSx
      : dialogStyles.contentSx;

  return (
    <StyledDialog
      content={
        fetchingTable ? (
          <StyledLoading size={CONSTANTS.LOADING_SIZE} />
        ) : tableList.length === 0 ? (
          <Typography color={'text.secondary'} fontSize={14}>
            You don&apos;t have any table yet.
          </Typography>
        ) : (
          <Stack gap={0.5}>
            {tableList.map((item) => (
              <StyledTableSelectItem
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
          disabled={!selectedTableId || fetchingCondition}
          loading={fetchingCondition}
          onClick={onConfirm}
          size={'medium'}
          sx={selectButtonSx}
        >
          {CONSTANTS.BUTTON_TEXT}
        </StyledButton>
      }
      footerSx={dialogStyles.footerSx}
      header={
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography sx={dialogTitleSx}>{CONSTANTS.DIALOG_TITLE}</Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={onClose}
            sx={closeIconLargeSx}
          />
        </Stack>
      }
      headerSx={dialogStyles.headerSx}
      onClose={onClose}
      open={visible}
    />
  );
};

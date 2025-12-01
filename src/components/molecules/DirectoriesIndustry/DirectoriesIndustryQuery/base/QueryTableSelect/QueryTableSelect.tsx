import { FC } from 'react';
import { Stack } from '@mui/material';

import { useSwitch } from '@/hooks';
import { useTableSelect } from './hooks';

import { DirectoriesQueryGroupTypeEnum } from '@/types/directories';
import { ProspectTableEnum } from '@/types';

import { QueryTableSelectDialog, QueryTableSelectInput } from './index';
import { QueryContainer } from '../QueryContainer';

interface FilterTableSelectProps {
  type: DirectoriesQueryGroupTypeEnum;
  selectedTableId?: string;
  selectedTableName?: string;
  selectedTableSource?: ProspectTableEnum;
  isLoading?: boolean;
  // Data synced to formValues (tableId and keywords)
  onFormDataChange?: (data: { tableId: string; keywords: string[] }) => void;
  // Data used for UI display only (tableName and tableSource)
  onDisplayDataChange?: (data: {
    tableName: string;
    tableSource?: ProspectTableEnum;
  }) => void;
  title?: string;
  placeholder?: string;
}

export const QueryTableSelect: FC<FilterTableSelectProps> = ({
  type,
  isLoading = false,
  selectedTableId,
  selectedTableName,
  selectedTableSource,
  onFormDataChange,
  onDisplayDataChange,
  title,
  placeholder,
}) => {
  const { open, visible, close } = useSwitch(false);
  const {
    fetchingTable,
    fetchingKeywords,
    innerTableId,
    outerTableName,
    outerTableSource,
    expandedIds,
    tableList,
    toggleExpand,
    setInnerTableId,
    fetchTableList,
    confirmTableSelection,
    resetSelection,
  } = useTableSelect({
    outerTableId: selectedTableId,
    outerTableName: selectedTableName,
    outerTableSource: selectedTableSource,
    type,
  });

  const onClickOpenDialog = async () => {
    open();
    await fetchTableList();
  };

  const onClickConfirm = async () => {
    await confirmTableSelection((keywords) => {
      onFormDataChange?.({
        tableId: innerTableId,
        keywords: keywords,
      });

      onDisplayDataChange?.({
        tableName: outerTableName,
        tableSource: outerTableSource,
      });
    }, close);
  };

  const onClickClearSelection = () => {
    resetSelection();

    onFormDataChange?.({
      tableId: '',
      keywords: [],
    });

    onDisplayDataChange?.({
      tableName: '',
      tableSource: undefined,
    });
  };

  return (
    <Stack>
      <QueryContainer label={title}>
        <QueryTableSelectInput
          isLoading={isLoading || fetchingTable || fetchingKeywords}
          onClearSelection={onClickClearSelection}
          onOpenDialog={onClickOpenDialog}
          placeholder={placeholder}
          selectedTableId={selectedTableId}
          selectedTableName={outerTableName}
          selectedTableSource={outerTableSource}
        />
      </QueryContainer>
      <QueryTableSelectDialog
        expandedIds={expandedIds}
        fetchingKeywords={fetchingKeywords}
        fetchingTable={fetchingTable}
        onClose={close}
        onConfirm={onClickConfirm}
        onSelectTable={setInnerTableId}
        onToggleExpand={toggleExpand}
        selectedTableId={innerTableId}
        tableList={tableList}
        visible={visible}
      />
    </Stack>
  );
};

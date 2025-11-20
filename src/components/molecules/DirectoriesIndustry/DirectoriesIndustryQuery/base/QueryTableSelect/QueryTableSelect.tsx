import { FC } from 'react';
import { Stack } from '@mui/material';

import { useSwitch } from '@/hooks';
import { useTableSelect } from './hooks';

import { QueryTableSelectDialog, QueryTableSelectInput } from './index';

import { DirectoriesQueryGroupTypeEnum } from '@/types/Directories/query';
import { ProspectTableEnum } from '@/types';

interface FilterTableSelectProps {
  type: DirectoriesQueryGroupTypeEnum;
  selectedTableId?: string;
  selectedTableName?: string;
  selectedTableSource?: ProspectTableEnum;
  isLoading?: boolean;
  // 同步到 formValues 的数据（tableId 和 keywords）
  onFormDataChange?: (data: { tableId: string; keywords: string[] }) => void;
  // 只用于 UI 显示的数据（tableName 和 tableSource）
  onDisplayDataChange?: (data: {
    tableName: string;
    tableSource?: ProspectTableEnum;
  }) => void;
}

export const QueryTableSelect: FC<FilterTableSelectProps> = ({
  type,
  isLoading = false,
  selectedTableId,
  selectedTableName,
  selectedTableSource,
  onFormDataChange,
  onDisplayDataChange,
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
      // 同步到 formValues
      onFormDataChange?.({
        tableId: innerTableId,
        keywords: keywords,
      });

      // 更新 UI 显示数据
      onDisplayDataChange?.({
        tableName: outerTableName,
        tableSource: outerTableSource,
      });
    }, close);
  };

  const onClickClearSelection = () => {
    resetSelection();

    // 清空 formValues
    onFormDataChange?.({
      tableId: '',
      keywords: [],
    });

    // 清空 UI 显示数据
    onDisplayDataChange?.({
      tableName: '',
      tableSource: undefined,
    });
  };

  return (
    <Stack>
      {/*<FilterContainer title={filterTitle}>*/}
      <QueryTableSelectInput
        isLoading={isLoading || fetchingTable || fetchingKeywords}
        onClearSelection={onClickClearSelection}
        onOpenDialog={onClickOpenDialog}
        selectedTableId={selectedTableId}
        selectedTableName={outerTableName}
        selectedTableSource={outerTableSource}
      />
      {/*</FilterContainer>*/}
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

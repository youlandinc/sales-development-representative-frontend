import { FC } from 'react';
import { Stack } from '@mui/material';

import { useSwitch } from '@/hooks';
import { useTableSelect } from './hooks';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FilterContainer } from '../index';
import { FilterTableSelectInput } from './FilterTableSelectInput';
import { FilterTableSelectDialog } from './FilterTableSelectDialog';

import { FilterElementTypeEnum } from '@/types';
import { CONSTANTS } from './FilterTableSelect.styles';

interface FilterTableSelectProps {
  type: FilterElementTypeEnum;
  selectedTableId?: string;
  selectedTableName?: string;
  storeField?: 'tableInclude' | 'tableExclude';
  onCompanyNamesChange?: (companyNames: string[]) => void;
  onSelectedTableIdChange?: (tableId: string) => void;
  onSelectedTableNameChange?: (tableName: string) => void;
}

export const FilterTableSelect: FC<FilterTableSelectProps> = ({
  type,
  selectedTableId,
  selectedTableName,
  storeField = 'tableInclude',
  onCompanyNamesChange,
  onSelectedTableIdChange,
  onSelectedTableNameChange,
}) => {
  const { queryConditions, setQueryConditions } = useFindPeopleCompanyStore(
    (state) => state,
  );
  const { open, visible, close } = useSwitch(false);
  const {
    fetchingTable,
    fetchingCondition,
    innerTableId,
    outerTableName,
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
    type,
  });

  const onClickOpenDialog = async () => {
    open();
    await fetchTableList();
  };

  const onClickConfirm = async () => {
    await confirmTableSelection((data, tableName) => {
      // Update store with table structure (tableInclude or tableExclude)
      setQueryConditions({
        ...queryConditions,
        [storeField]: {
          tableId: innerTableId,
          tableFieldId: '',
          tableViewId: '',
          keywords: storeField === 'tableExclude' ? [] : data,
        },
      });

      // Keep existing callbacks for backward compatibility
      onCompanyNamesChange?.(data);
      onSelectedTableIdChange?.(innerTableId);
      onSelectedTableNameChange?.(tableName);
    }, close);
  };

  const onClickClearSelection = () => {
    resetSelection();

    // Clear store value (tableInclude or tableExclude)
    setQueryConditions({
      ...queryConditions,
      [storeField]: {
        tableId: '',
        tableFieldId: '',
        tableViewId: '',
        keywords: [],
      },
    });

    // Keep existing callbacks for backward compatibility
    onCompanyNamesChange?.([]);
    onSelectedTableIdChange?.('');
    onSelectedTableNameChange?.('');
  };

  const filterTitle =
    type === FilterElementTypeEnum.exclude_table
      ? 'Table'
      : CONSTANTS.FILTER_TITLE;

  return (
    <Stack>
      <FilterContainer title={filterTitle}>
        <FilterTableSelectInput
          onClearSelection={onClickClearSelection}
          onOpenDialog={onClickOpenDialog}
          selectedTableId={selectedTableId}
          selectedTableName={outerTableName}
        />
      </FilterContainer>
      <FilterTableSelectDialog
        expandedIds={expandedIds}
        fetchingCondition={fetchingCondition}
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

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
  onCompanyNamesChange?: (companyNames: string[]) => void;
  onSelectedTableIdChange?: (tableId: string) => void;
  onSelectedTableNameChange?: (tableName: string) => void;
}

export const FilterTableSelect: FC<FilterTableSelectProps> = ({
  selectedTableId,
  selectedTableName,
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
  });

  const onClickOpenDialog = async () => {
    open();
    await fetchTableList();
  };

  const onClickConfirm = async () => {
    await confirmTableSelection((data, tableName) => {
      // Update store with tableInclude structure
      setQueryConditions({
        ...queryConditions,
        tableInclude: {
          tableId: innerTableId,
          tableFieldId: '',
          tableViewId: '',
          keywords: data,
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

    // Clear store value
    setQueryConditions({
      ...queryConditions,
      tableInclude: {
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

  return (
    <Stack>
      <FilterContainer title={CONSTANTS.FILTER_TITLE}>
        <FilterTableSelectInput
          onClearSelection={onClickClearSelection}
          onOpenDialog={onClickOpenDialog}
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

import { useEffect, useState } from 'react';
import { _fetchAllProspectTable, _fetchCompanyNameViaTableId } from '@/request';
import {
  FilterElementTypeEnum,
  HttpError,
  ProspectTableEnum,
  ResponseProspectTableViaSearch,
} from '@/types';
import { SDRToast } from '@/components/atoms';

interface UseTableSelectParams {
  outerTableId?: string;
  outerTableName?: string;
  outerTableSource?: ProspectTableEnum;
  type?: FilterElementTypeEnum;
}

interface UseTableSelectReturn {
  // State
  fetchingTable: boolean;
  fetchingCondition: boolean;
  innerTableId: string;
  outerTableId: string;
  outerTableName: string;
  outerTableSource: ProspectTableEnum | undefined;
  expandedIds: Set<string>;
  tableList: ResponseProspectTableViaSearch;

  // Actions
  toggleExpand: (tableId: string) => void;
  setInnerTableId: (id: string) => void;
  fetchTableList: () => Promise<void>;
  confirmTableSelection: (
    onConfirm: (
      data: string[],
      tableName: string,
      tableSource?: ProspectTableEnum,
    ) => void,
    onClose: () => void,
  ) => Promise<void>;
  resetSelection: () => void;
}

export const useTableSelect = (
  params?: UseTableSelectParams,
): UseTableSelectReturn => {
  const {
    outerTableId: externalOuterTableId,
    outerTableName: externalOuterTableName,
    outerTableSource: externalOuterTableSource,
    type,
  } = params || {};
  const [fetchingTable, setFetchingTable] = useState(false);
  const [fetchingCondition, setFetchingCondition] = useState(false);
  const [innerTableId, setInnerTableId] = useState('');
  const [outerTableId, setOuterTableId] = useState('');
  const [outerTableName, setOuterTableName] = useState('');
  const [outerTableSource, setOuterTableSource] = useState<
    ProspectTableEnum | undefined
  >(undefined);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [tableList, setTableList] = useState<ResponseProspectTableViaSearch>(
    [],
  );

  // Sync external outer table id and name with internal state
  useEffect(() => {
    if (externalOuterTableId !== undefined) {
      setOuterTableId(externalOuterTableId);
      // Also set innerTableId so dialog shows the selected table
      if (externalOuterTableId) {
        setInnerTableId(externalOuterTableId);
      }
    }
    if (externalOuterTableName !== undefined) {
      setOuterTableName(externalOuterTableName);
    }
    if (externalOuterTableSource !== undefined) {
      setOuterTableSource(externalOuterTableSource);
    }
  }, [externalOuterTableId, externalOuterTableName, externalOuterTableSource]);

  // If tableList is loaded and we have outerTableId but no outerTableName or outerTableSource, derive them
  useEffect(() => {
    if (outerTableId && tableList.length > 0) {
      const tableItem = tableList
        .flat()
        .find((item) => item.tableId === outerTableId);
      if (tableItem) {
        if (!outerTableName) {
          setOuterTableName(tableItem.tableName);
        }
        if (!outerTableSource) {
          setOuterTableSource(tableItem.source);
        }
      }
    }
  }, [outerTableId, outerTableName, outerTableSource, tableList]);

  const toggleExpand = (tableId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tableId)) {
        newSet.delete(tableId);
      } else {
        newSet.add(tableId);
      }
      return newSet;
    });
  };

  const fetchTableList = async () => {
    setFetchingTable(true);
    try {
      const { data } = await _fetchAllProspectTable();
      setTableList(data);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setFetchingTable(false);
    }
  };

  const confirmTableSelection = async (
    onConfirm: (
      data: string[],
      tableName: string,
      tableSource?: ProspectTableEnum,
    ) => void,
    onClose: () => void,
  ) => {
    if (!innerTableId) {
      return;
    }

    const tableItem = tableList
      .flat()
      .find((item) => item.tableId === innerTableId);
    const tableName = tableItem?.tableName || '';
    const tableSource = tableItem?.source;

    // For exclude_people type, skip fetching company names
    if (type === FilterElementTypeEnum.exclude_table) {
      setOuterTableId(innerTableId);
      setOuterTableName(tableName);
      setOuterTableSource(tableSource);
      onConfirm([], tableName, tableSource);
      onClose();
      return;
    }

    // For companies type, fetch company names from the table
    setFetchingCondition(true);
    try {
      const { data } = await _fetchCompanyNameViaTableId(innerTableId);

      setOuterTableId(innerTableId);
      setOuterTableName(tableName);
      setOuterTableSource(tableSource);
      onConfirm(data, tableName, tableSource);
      onClose();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setFetchingCondition(false);
    }
  };

  const resetSelection = () => {
    setInnerTableId('');
    setOuterTableId('');
    setOuterTableName('');
    setOuterTableSource(undefined);
  };

  return {
    fetchingTable,
    fetchingCondition,
    innerTableId,
    outerTableId,
    outerTableName,
    outerTableSource,
    expandedIds,
    tableList,
    toggleExpand,
    setInnerTableId,
    fetchTableList,
    confirmTableSelection,
    resetSelection,
  };
};

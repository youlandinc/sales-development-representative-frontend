import { useEffect, useState } from 'react';
import { _fetchAllProspectTable, _fetchCompanyNameViaTableId } from '@/request';
import {
  FilterElementTypeEnum,
  HttpError,
  ResponseProspectTableViaSearch,
} from '@/types';
import { SDRToast } from '@/components/atoms';

interface UseTableSelectParams {
  outerTableId?: string;
  outerTableName?: string;
  type?: FilterElementTypeEnum;
}

interface UseTableSelectReturn {
  // State
  fetchingTable: boolean;
  fetchingCondition: boolean;
  innerTableId: string;
  outerTableId: string;
  outerTableName: string;
  expandedIds: Set<string>;
  tableList: ResponseProspectTableViaSearch;

  // Actions
  toggleExpand: (tableId: string) => void;
  setInnerTableId: (id: string) => void;
  fetchTableList: () => Promise<void>;
  confirmTableSelection: (
    onConfirm: (data: string[], tableName: string) => void,
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
    type,
  } = params || {};
  const [fetchingTable, setFetchingTable] = useState(false);
  const [fetchingCondition, setFetchingCondition] = useState(false);
  const [innerTableId, setInnerTableId] = useState('');
  const [outerTableId, setOuterTableId] = useState('');
  const [outerTableName, setOuterTableName] = useState('');
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
  }, [externalOuterTableId, externalOuterTableName]);

  // If tableList is loaded and we have outerTableId but no outerTableName, derive it
  useEffect(() => {
    if (outerTableId && !outerTableName && tableList.length > 0) {
      const tableName =
        tableList.flat().find((item) => item.tableId === outerTableId)
          ?.tableName || '';
      if (tableName) {
        setOuterTableName(tableName);
      }
    }
  }, [outerTableId, outerTableName, tableList]);

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
    onConfirm: (data: string[], tableName: string) => void,
    onClose: () => void,
  ) => {
    if (!innerTableId) {
      return;
    }

    const tableName =
      tableList.flat().find((item) => item.tableId === innerTableId)
        ?.tableName || '';

    // For exclude_people type, skip fetching company names
    if (type === FilterElementTypeEnum.exclude_table) {
      setOuterTableId(innerTableId);
      setOuterTableName(tableName);
      onConfirm([], tableName);
      onClose();
      return;
    }

    // For companies type, fetch company names from the table
    setFetchingCondition(true);
    try {
      const { data } = await _fetchCompanyNameViaTableId(innerTableId);

      setOuterTableId(innerTableId);
      setOuterTableName(tableName);
      onConfirm(data, tableName);
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
  };

  return {
    fetchingTable,
    fetchingCondition,
    innerTableId,
    outerTableId,
    outerTableName,
    expandedIds,
    tableList,
    toggleExpand,
    setInnerTableId,
    fetchTableList,
    confirmTableSelection,
    resetSelection,
  };
};

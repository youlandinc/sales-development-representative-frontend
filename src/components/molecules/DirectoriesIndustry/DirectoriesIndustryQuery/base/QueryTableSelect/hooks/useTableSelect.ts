import { useEffect, useState } from 'react';

import { SDRToast } from '@/components/atoms';
import { DirectoriesQueryGroupTypeEnum } from '@/types/directories';
import { _fetchAllProspectTable, _fetchCompanyNameViaTableId } from '@/request';
import {
  HttpError,
  ProspectTableEnum,
  ResponseProspectTableViaSearch,
} from '@/types';

interface UseTableSelectParams {
  outerTableId?: string;
  outerTableName?: string;
  outerTableSource?: ProspectTableEnum;
  type?: DirectoriesQueryGroupTypeEnum;
}

interface UseTableSelectReturn {
  // State
  fetchingTable: boolean;
  fetchingKeywords: boolean;

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
    onConfirm: (keywords: string[]) => void,
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
  const [fetchingKeywords, setFetchingKeywords] = useState(false);

  const [innerTableId, setInnerTableId] = useState('');
  const [outerTableId, setOuterTableId] = useState(externalOuterTableId || '');
  const [outerTableName, setOuterTableName] = useState(
    externalOuterTableName || '',
  );
  const [outerTableSource, setOuterTableSource] = useState<
    ProspectTableEnum | undefined
  >(externalOuterTableSource);

  const [tableList, setTableList] = useState<ResponseProspectTableViaSearch>(
    [],
  );

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Sync external values with internal state
  useEffect(() => {
    if (externalOuterTableId !== undefined) {
      setOuterTableId(externalOuterTableId);
      // Also set innerTableId so dialog shows the selected table
      if (externalOuterTableId) {
        setInnerTableId(externalOuterTableId);
      }
    }
  }, [externalOuterTableId]);

  useEffect(() => {
    if (externalOuterTableName !== undefined) {
      setOuterTableName(externalOuterTableName);
    }
  }, [externalOuterTableName]);

  useEffect(() => {
    if (externalOuterTableSource !== undefined) {
      setOuterTableSource(externalOuterTableSource);
    }
  }, [externalOuterTableSource]);

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
    onConfirm: (keywords: string[]) => void,
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

    // Update outer state for display
    setOuterTableId(innerTableId);
    setOuterTableName(tableName);
    setOuterTableSource(tableSource);

    // For exclude_individuals type, keywords is always empty
    if (type === DirectoriesQueryGroupTypeEnum.exclude_individuals) {
      onConfirm([]);
      onClose();
      return;
    }

    // For exclude_firms type, fetch company names from the table
    setFetchingKeywords(true);
    try {
      const { data } = await _fetchCompanyNameViaTableId(innerTableId);
      onConfirm(data);
      onClose();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setFetchingKeywords(false);
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
    fetchingKeywords,

    innerTableId,
    outerTableId,
    outerTableName,
    outerTableSource,

    tableList,
    expandedIds,

    toggleExpand,
    setInnerTableId,
    fetchTableList,
    confirmTableSelection,
    resetSelection,
  };
};

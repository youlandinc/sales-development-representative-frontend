import { FC, useEffect, useState } from 'react';
import { FilterElementTypeEnum, ProspectTableEnum } from '@/types';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FilterTableSelect } from './index';

interface FilterExcludePeopleProps {
  type: FilterElementTypeEnum;
}

export const FilterExcludeTable: FC<FilterExcludePeopleProps> = ({ type }) => {
  const { queryConditions } = useFindPeopleCompanyStore((state) => state);

  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedTableSource, setSelectedTableSource] = useState<
    ProspectTableEnum | undefined
  >(undefined);

  // Initialize from store on mount
  useEffect(() => {
    const storeTableId = queryConditions?.tableExclude?.tableId;
    if (storeTableId) {
      setSelectedTableId(storeTableId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FilterTableSelect
        onSelectedTableIdChange={(tableId) => setSelectedTableId(tableId)}
        onSelectedTableNameChange={(tableName) =>
          setSelectedTableName(tableName)
        }
        onSelectedTableSourceChange={(tableSource) =>
          setSelectedTableSource(tableSource)
        }
        selectedTableId={selectedTableId}
        selectedTableName={selectedTableName}
        selectedTableSource={selectedTableSource}
        storeField="tableExclude"
        type={type}
      />
    </>
  );
};

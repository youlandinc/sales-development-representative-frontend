import { FC, useEffect, useState } from 'react';
import { FilterElementTypeEnum } from '@/types';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FilterTableSelect } from './index';

interface FilterExcludePeopleProps {
  type: FilterElementTypeEnum;
}

export const FilterExcludePeople: FC<FilterExcludePeopleProps> = ({ type }) => {
  const { queryConditions } = useFindPeopleCompanyStore((state) => state);

  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedTableName, setSelectedTableName] = useState<string>('');

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
        selectedTableId={selectedTableId}
        selectedTableName={selectedTableName}
        storeField="tableExclude"
        type={type}
      />
    </>
  );
};

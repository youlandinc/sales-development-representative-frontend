import { FC, useState } from 'react';
import { ProspectTableEnum } from '@/types';

import { DirectoriesQueryGroupTypeEnum } from '@/types/directories';
import { QueryTableSelect, QueryTableWithListValue } from './index';

interface QueryTableProps {
  type: DirectoriesQueryGroupTypeEnum;
  fieldKey: string;
  value?: QueryTableWithListValue;
  onFormChange: (key: string, value: QueryTableWithListValue) => void;
}

export const QueryTable: FC<QueryTableProps> = ({
  type,
  fieldKey,
  value,
  onFormChange,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    value?.tableId || '',
  );
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedTableSource, setSelectedTableSource] = useState<
    ProspectTableEnum | undefined
  >(undefined);

  return (
    <>
      <QueryTableSelect
        onDisplayDataChange={(data) => {
          setSelectedTableName(data.tableName);
          setSelectedTableSource(data.tableSource);
        }}
        onFormDataChange={(data) => {
          setSelectedTableId(data.tableId);

          onFormChange(fieldKey, {
            tableId: data.tableId,
            tableFieldId: '',
            tableViewId: '',
            keywords: [],
          });
        }}
        selectedTableId={selectedTableId}
        selectedTableName={selectedTableName}
        selectedTableSource={selectedTableSource}
        type={type}
      />
    </>
  );
};

import { FC, useState } from 'react';
import { EnrichmentTableEnum } from '@/types';

import { DirectoriesQueryGroupTypeEnum } from '@/types/directories';
import { QueryTableSelect, QueryTableWithListValue } from './index';

interface QueryTableProps {
  type: DirectoriesQueryGroupTypeEnum;
  fieldKey: string;
  value?: QueryTableWithListValue;
  onFormChange: (key: string, value: QueryTableWithListValue) => void;
  placeholder: string;
}

export const QueryTable: FC<QueryTableProps> = ({
  type,
  fieldKey,
  value,
  onFormChange,
  placeholder,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    value?.tableId || '',
  );
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedTableSource, setSelectedTableSource] = useState<
    EnrichmentTableEnum | undefined
  >(undefined);

  return (
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
      placeholder={placeholder}
      selectedTableId={selectedTableId}
      selectedTableName={selectedTableName}
      selectedTableSource={selectedTableSource}
      title={''}
      type={type}
    />
  );
};

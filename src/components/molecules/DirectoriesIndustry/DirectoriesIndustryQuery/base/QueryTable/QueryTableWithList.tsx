import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import { StyledRadioGroup } from '@/components/atoms';
import { QueryListTextArea, QueryTableSelect } from './index';

import { ProspectTableEnum } from '@/types';
import { DirectoriesQueryGroupTypeEnum } from '@/types/directories';

enum CompaniesRadioEnum {
  list = 'LIST',
  table = 'TABLE',
}

export interface QueryTableWithListValue {
  tableId: string;
  tableFieldId: string;
  tableViewId: string;
  keywords: string[];
}

interface QueryTableWithListProps {
  type: DirectoriesQueryGroupTypeEnum;
  fieldKey: string;
  value?: QueryTableWithListValue;
  optionValues: Array<{
    label: string;
    key: CompaniesRadioEnum | string;
    value: CompaniesRadioEnum | string;
    selected?: boolean | null;
    title?: string;
    placeholder?: string;
  }>;
  onFormChange: (key: string, value: QueryTableWithListValue) => void;
}

export const QueryTableWithList: FC<QueryTableWithListProps> = ({
  type,
  fieldKey,
  value,
  optionValues,
  onFormChange,
}) => {
  const [mode, setMode] = useState<CompaniesRadioEnum>(CompaniesRadioEnum.list);

  const [selectedTableId, setSelectedTableId] = useState<string>(
    value?.tableId || '',
  );
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedTableSource, setSelectedTableSource] = useState<
    ProspectTableEnum | undefined
  >(undefined);

  const [keywords, setKeywords] = useState<string[]>(value?.keywords || []);

  const { title = '', placeholder = '' } =
    optionValues.find((item) => item.value === mode) ?? {};

  const renderNode = () => {
    switch (mode) {
      case CompaniesRadioEnum.table:
        return (
          <QueryTableSelect
            onDisplayDataChange={(data) => {
              setSelectedTableName(data.tableName);
              setSelectedTableSource(data.tableSource);
            }}
            onFormDataChange={(data) => {
              setSelectedTableId(data.tableId);
              setKeywords(data.keywords);

              onFormChange(fieldKey, {
                tableFieldId: '',
                tableViewId: '',
                tableId: data.tableId,
                keywords: data.keywords,
              });
            }}
            placeholder={placeholder}
            selectedTableId={selectedTableId}
            selectedTableName={selectedTableName}
            selectedTableSource={selectedTableSource}
            title={title}
            type={type}
          />
        );
      case CompaniesRadioEnum.list:
        return (
          <QueryListTextArea
            onInsideFormChange={(keywords) => {
              setKeywords(keywords);

              onFormChange(fieldKey, {
                tableFieldId: '',
                tableViewId: '',
                tableId: selectedTableId,
                keywords: keywords,
              });
            }}
            placeholder={placeholder}
            title={title}
            value={keywords}
          />
        );
    }
  };

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack sx={{ mt: 0.5 }}>
        <StyledRadioGroup
          onChange={(_, val) => setMode(val as string as CompaniesRadioEnum)}
          options={optionValues}
          value={mode}
        />
      </Stack>

      {renderNode()}
    </Stack>
  );
};

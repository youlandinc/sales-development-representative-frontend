import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import { StyledRadioGroup } from '@/components/atoms';
import { QueryListTextArea, QueryTableSelect } from './index';
import { DirectoriesQueryGroupTypeEnum } from '@/types/Directories/query';
import { ProspectTableEnum } from '@/types';

enum CompaniesRadioEnum {
  list = 'LIST',
  table = 'TABLE',
}

const COMPANIES_OPTIONS = [
  {
    label: 'SalesOS table of companies',
    key: CompaniesRadioEnum.table,
    value: CompaniesRadioEnum.table,
  },
  {
    label: 'List of company identifiers',
    key: CompaniesRadioEnum.list,
    value: CompaniesRadioEnum.list,
  },
];

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
  onFormChange: (key: string, value: QueryTableWithListValue) => void;
}

export const QueryTableWithList: FC<QueryTableWithListProps> = ({
  type,
  fieldKey,
  value,
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

  const renderNode = () => {
    switch (mode) {
      case CompaniesRadioEnum.table:
        return (
          <QueryTableSelect
            onDisplayDataChange={(data) => {
              // 只更新内部 UI 显示状态
              setSelectedTableName(data.tableName);
              setSelectedTableSource(data.tableSource);
            }}
            onFormDataChange={(data) => {
              // 更新内部状态
              setSelectedTableId(data.tableId);
              setKeywords(data.keywords);

              // 同步到外层 formValues（触发 onFormChange）
              onFormChange(fieldKey, {
                tableFieldId: '',
                tableViewId: '',
                tableId: data.tableId,
                keywords: data.keywords,
              });
            }}
            selectedTableId={selectedTableId}
            selectedTableName={selectedTableName}
            selectedTableSource={selectedTableSource}
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
            value={keywords}
          />
        );
    }
  };

  return (
    <Stack gap={1.5}>
      <Stack mt={0.5}>
        <StyledRadioGroup
          onChange={(_, val) => setMode(val as string as CompaniesRadioEnum)}
          options={COMPANIES_OPTIONS}
          value={mode}
        />
      </Stack>

      {renderNode()}
    </Stack>
  );
};

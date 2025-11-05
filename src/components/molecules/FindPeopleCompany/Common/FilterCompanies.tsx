import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

import { StyledRadioGroup } from '@/components/atoms';
import { FilterListTextArea, FilterTableSelect } from './index';
import { FilterElementTypeEnum } from '@/types';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

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

interface FilterCompaniesProps {
  type: FilterElementTypeEnum;
}

export const FilterCompanies: FC<FilterCompaniesProps> = ({ type }) => {
  const { queryConditions, setQueryConditions } = useFindPeopleCompanyStore(
    (state) => state,
  );

  const [radioValue, setRadioValue] = useState<CompaniesRadioEnum>(
    CompaniesRadioEnum.list,
  );

  const [companyName, setCompanyName] = useState<string[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedTableName, setSelectedTableName] = useState<string>('');

  // Initialize from store on mount
  useEffect(() => {
    const storeKeywords = queryConditions?.tableInclude?.keywords;
    if (Array.isArray(storeKeywords) && storeKeywords.length > 0) {
      setCompanyName(storeKeywords);
    }
    const storeTableId = queryConditions?.tableInclude?.tableId;
    if (storeTableId) {
      setSelectedTableId(storeTableId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderNode = () => {
    switch (radioValue) {
      case CompaniesRadioEnum.table:
        return (
          <FilterTableSelect
            onCompanyNamesChange={(companyNames) => {
              setCompanyName(companyNames);
            }}
            onSelectedTableIdChange={(tableId) => setSelectedTableId(tableId)}
            onSelectedTableNameChange={(tableName) =>
              setSelectedTableName(tableName)
            }
            selectedTableId={selectedTableId}
            selectedTableName={selectedTableName}
            type={type}
          />
        );
      case CompaniesRadioEnum.list:
        return (
          <FilterListTextArea
            onChange={(param) => {
              setCompanyName(param);
              setQueryConditions({
                ...queryConditions,
                tableInclude: {
                  ...queryConditions.tableInclude,
                  keywords: param,
                },
              });
            }}
            state={companyName}
          />
        );
    }
  };

  return (
    <Stack gap={1.5}>
      <Stack mt={0.5}>
        <StyledRadioGroup
          onChange={(_, val) => {
            const newValue = val as string as CompaniesRadioEnum;
            setRadioValue(newValue);
          }}
          options={COMPANIES_OPTIONS}
          value={radioValue}
        />
      </Stack>

      {renderNode()}
    </Stack>
  );
};

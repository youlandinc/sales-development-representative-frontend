import { FC, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement } from './CreateQueryElement';
import { TITLE_MAP } from '@/constants/directories';
import { MOCK_QUERY_CONFIG } from './mockData';
import { DirectoriesQueryItem } from '@/types/Directories/query';
import useSWR from 'swr';
import { _fetchDirectoriesConfig } from '@/request/directories/query';
import { DirectoriesBizIdEnum } from '@/types/Directories';

const collectFormKeys = (
  config: DirectoriesQueryItem,
  result: Record<string, any>,
  groupPath?: string,
): void => {
  const { groupType, isGroup, key, children } = config;

  if (groupType === 'TAB' && isGroup && key) {
    result[key] =
      config.defaultValues ?? config.optionValues?.[0]?.value ?? null;
    return;
  }

  if (groupType === 'BUTTON_GROUP' && isGroup && key) {
    result[key] =
      config.defaultValues ?? config.optionValues?.[0]?.value ?? null;
    return;
  }

  if (groupType === 'GENERAL') {
    if (children && children.length > 0) {
      children.forEach((child) => {
        collectFormKeys(child, result, groupPath);
      });
    }
    return;
  }

  if (groupType === 'EXCLUDE_FIRMS' || groupType === 'EXCLUDE_INDIVIDUALS') {
    if (key) {
      result[key] = {
        tableId: '',
        tableFieldId: '',
        tableViewId: '',
        keywords: [],
      };
    }
    return;
  }

  if (groupType === 'ADDITIONAL_DETAILS') {
    return;
  }

  if (key) {
    if (groupPath && groupPath !== 'root') {
      result[key] = config.defaultValues ?? null;
    } else {
      result[key] = config.defaultValues ?? null;
    }
  }

  if (children && children.length > 0) {
    children.forEach((child) => {
      collectFormKeys(child, result);
    });
  }
};

const initializeFormValues = (
  configs: DirectoriesQueryItem[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  const institutionTypeConfig = configs.find(
    (c) => c.key === 'institutionType' && c.groupType === 'BUTTON_GROUP',
  );

  if (!institutionTypeConfig) {
    return result;
  }

  const defaultInstitutionType =
    institutionTypeConfig.defaultValues ??
    institutionTypeConfig.optionValues?.[0]?.value;

  if (!defaultInstitutionType) {
    return result;
  }

  result.institutionType = defaultInstitutionType;

  let institutionChild = institutionTypeConfig.children?.find(
    (child) => child.defaultValues === defaultInstitutionType,
  );

  if (!institutionChild && institutionTypeConfig.children?.length > 0) {
    institutionChild = institutionTypeConfig.children[0];
    result.institutionType =
      institutionChild.defaultValues || defaultInstitutionType;
  }

  if (!institutionChild) {
    return result;
  }

  const entityTypeConfig = institutionChild.children?.find(
    (c) => c.groupType === 'TAB' && c.isGroup && c.key,
  );

  if (!entityTypeConfig) {
    return result;
  }

  const defaultEntityType =
    entityTypeConfig.defaultValues ?? entityTypeConfig.optionValues?.[0]?.value;

  if (entityTypeConfig.key) {
    result[entityTypeConfig.key] = defaultEntityType;
  }

  if (entityTypeConfig.children && entityTypeConfig.children.length > 0) {
    entityTypeConfig.children.forEach((tabChild, index) => {
      const optionValue = entityTypeConfig.optionValues?.[index];
      const tabKey = optionValue?.value;

      if (tabKey) {
        result[tabKey] = {};
        collectFormKeys(tabChild, result[tabKey], tabKey);
      }
    });
  }

  if (entityTypeConfig.children && entityTypeConfig.children.length > 0) {
    entityTypeConfig.children.forEach((tabChild, index) => {
      const optionValue = entityTypeConfig.optionValues?.[index];
      const tabKey = optionValue?.value;

      if (tabKey && result[tabKey]) {
        institutionChild.children?.forEach((child) => {
          if (
            child.groupType === 'EXCLUDE_FIRMS' ||
            child.groupType === 'EXCLUDE_INDIVIDUALS'
          ) {
            collectFormKeys(child, result[tabKey], tabKey);
          }
        });
      }
    });
  }

  return result;
};

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;

  const initialFormValues = useMemo(
    () => initializeFormValues(MOCK_QUERY_CONFIG),
    [],
  );

  useSWR('123', async () => {
    const { data } = await _fetchDirectoriesConfig({
      bizId: DirectoriesBizIdEnum.capital_markets,
    });
    console.log(data);
  });

  useSWR('456', async () => {
    const { data } = await _fetchDirectoriesConfig({
      bizId: DirectoriesBizIdEnum.capital_markets,
      institutionType: 'SERVICE_PROVIDERS',
    });
    console.log(data, 'INVESTORS_FUNDS');
  });

  const [formValues, setFormValues] = useState<any>(initialFormValues);

  const onFormChange = (
    key: string | undefined | null,
    value: any,
    groupPath?: string,
  ) => {
    if (!key) {
      return;
    }

    setFormValues((prev: any) => {
      if (key === 'entityType' || key === 'institutionType') {
        return {
          ...prev,
          [key]: value,
        };
      }

      if (groupPath && prev[groupPath]) {
        return {
          ...prev,
          [groupPath]: {
            ...prev[groupPath],
            [key]: value,
          },
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  console.log('📋 Form Values:', formValues);
  console.log('📊 Current Entity Type:', formValues.entityType);
  console.log('📦 Current Entity Data:', formValues[formValues.entityType]);

  return (
    <Stack
      sx={{
        width: 420,
        gap: 3,
        p: 3,
        height: 'auto',
        overflowY: 'auto',
      }}
    >
      <QueryBreadcrumbs current={TITLE_MAP[industrySlug] || 'Directory'} />

      {MOCK_QUERY_CONFIG.map((config) => (
        <CreateQueryElement
          config={config}
          formData={formValues}
          key={config.key || config.label || ''}
          onFormChange={onFormChange}
        />
      ))}
    </Stack>
  );
};

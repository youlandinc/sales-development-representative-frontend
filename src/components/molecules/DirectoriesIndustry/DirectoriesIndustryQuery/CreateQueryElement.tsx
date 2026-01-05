import { FC, useCallback } from 'react';
import { Stack } from '@mui/material';

import {
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryComponentNameEnum,
  DirectoriesQueryGroupTypeEnum,
  DirectoriesQueryInputTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';
import { countFilledFieldsInGroup } from '@/utils/directories';
import { useDirectoriesStore } from '@/stores/directories';

import { StyledButtonGroup, StyledTextFieldNumber } from '@/components/atoms';
import {
  QueryAdditionalDetails,
  QueryAutoComplete,
  QueryCascadeSelect,
  QueryCascadeSelectExternal,
  QueryCheckbox,
  QueryCollapse,
  QueryContainer,
  QueryDateSelectRange,
  QuerySwitch,
  QueryTab,
  QueryTable,
  QueryTableWithList,
} from './base';

interface CreateQueryElementProps {
  config: DirectoriesQueryItem;
  formData: any;
  onFormChange: (
    key: string | undefined | null,
    newValue: any,
    groupPath?: string,
  ) => void;
  groupPath?: string;
  disabledLoading?: boolean;
  hideAuthBadge?: boolean;
}

export const CreateQueryElement: FC<CreateQueryElementProps> = ({
  config,
  formData,
  onFormChange,
  groupPath,
  disabledLoading = false,
  hideAuthBadge = false,
}) => {
  // ============================================
  // Shared computation
  // ============================================
  const resetGroupFormValues = useDirectoriesStore(
    (state) => state.resetGroupFormValues,
  );

  const onFiltersReset = useCallback(() => {
    resetGroupFormValues(config, groupPath);
  }, [resetGroupFormValues, config, groupPath]);

  const containerIsAuth = hideAuthBadge ? true : (config.isAuth ?? true);

  // ============================================
  // Guard: condition check
  // ============================================
  if (config.condition && config.condition.includes('=')) {
    const eqIndex = config.condition.indexOf('=');
    const conditionKey = config.condition.slice(0, eqIndex);
    const conditionValue = config.condition.slice(eqIndex + 1);

    // Skip invalid condition format
    if (!conditionKey || !conditionValue) {
      // Invalid condition, render normally
    } else if (formData && typeof formData === 'object') {
      // Find field value, supporting nested structure (L1/L3)
      let fieldValue = formData[conditionKey];
      if (fieldValue === undefined) {
        // Try nested: formData[tabValue][conditionKey]
        for (const topKey of Object.keys(formData)) {
          const topValue = formData[topKey];
          if (typeof topValue === 'string' && formData[topValue]) {
            const nestedData = formData[topValue];
            if (
              typeof nestedData === 'object' &&
              nestedData !== null &&
              conditionKey in nestedData
            ) {
              fieldValue = nestedData[conditionKey];
              break;
            }
          }
        }
      }

      const isConditionMet = Array.isArray(fieldValue)
        ? fieldValue.includes(conditionValue)
        : fieldValue === conditionValue;

      if (!isConditionMet) {
        return null;
      }
    }
  }

  // ============================================
  // Section 1: Container Types (groupType)
  // ============================================
  switch (config.groupType) {
    case DirectoriesQueryGroupTypeEnum.button_group:
      return (
        <QueryContainer
          isAuth={config.isAuth}
          label={config.label}
          labelSx={{ fontWeight: 600, fontSize: 14 }}
          showTips={config.showTips}
        >
          <StyledButtonGroup
            onChange={(event, newValue) => {
              if (newValue) {
                onFormChange?.(config.key, newValue, groupPath);
              }
            }}
            options={config.optionValues || []}
            value={formData[config.key!] ?? ''}
          />
          {config.children && config.children.length > 0 && (
            <Stack gap={2} sx={{ mt: 1.5 }}>
              {config.children.map((child: DirectoriesQueryItem) => (
                <CreateQueryElement
                  config={child}
                  disabledLoading={disabledLoading}
                  formData={formData}
                  groupPath={groupPath}
                  key={child.key || child.label || ''}
                  onFormChange={onFormChange}
                />
              ))}
            </Stack>
          )}
        </QueryContainer>
      );

    case DirectoriesQueryGroupTypeEnum.tab:
      return (
        <QueryTab
          config={config}
          onFormChange={(newValue) => onFormChange?.(config.key, newValue)}
          renderChild={(child, childIndex) => {
            const optionValue = config.optionValues?.[childIndex];
            const tabGroupPath = optionValue?.value || groupPath || '';

            return (
              <CreateQueryElement
                config={child}
                disabledLoading={disabledLoading}
                formData={
                  tabGroupPath ? formData[tabGroupPath] || {} : formData
                }
                groupPath={tabGroupPath}
                key={child.key || child.label || ''}
                onFormChange={onFormChange}
              />
            );
          }}
          value={config.key ? formData[config.key] : null}
        />
      );

    case DirectoriesQueryGroupTypeEnum.general: {
      const filterCount = countFilledFieldsInGroup(config, formData);
      return (
        <QueryCollapse
          defaultOpen={config.isDefaultOpen ?? false}
          filterCount={filterCount}
          isAuth={config.isAuth}
          onClearFilters={onFiltersReset}
          title={config.label}
          tooltip={config.tooltip}
        >
          {config.children && config.children.length > 0
            ? config.children.map((child: DirectoriesQueryItem) => (
                <CreateQueryElement
                  config={child}
                  formData={formData}
                  groupPath={groupPath}
                  hideAuthBadge={!config.isAuth}
                  key={child.key || child.label || ''}
                  onFormChange={onFormChange}
                />
              ))
            : null}
        </QueryCollapse>
      );
    }

    case DirectoriesQueryGroupTypeEnum.exclude_firms: {
      const filterCount = countFilledFieldsInGroup(config, formData);
      return (
        <QueryCollapse
          defaultOpen={config.isDefaultOpen ?? false}
          filterCount={filterCount}
          isAuth={config.isAuth}
          onClearFilters={onFiltersReset}
          title={config.label}
          tooltip={config.tooltip}
        >
          <QueryTableWithList
            fieldKey={config.key!}
            key={`${groupPath}-${config.key}`}
            onFormChange={(key, value) => onFormChange(key, value, groupPath)}
            optionValues={config.optionValues}
            type={DirectoriesQueryGroupTypeEnum.exclude_firms}
            value={
              formData[config.key!] ?? {
                tableId: '',
                tableFieldId: '',
                tableViewId: '',
                keywords: [],
              }
            }
          />
        </QueryCollapse>
      );
    }

    case DirectoriesQueryGroupTypeEnum.exclude_individuals: {
      const filterCount = countFilledFieldsInGroup(config, formData);
      return (
        <QueryCollapse
          defaultOpen={config.isDefaultOpen ?? false}
          filterCount={filterCount}
          isAuth={config.isAuth}
          onClearFilters={onFiltersReset}
          title={config.label}
          tooltip={config.tooltip}
        >
          <QueryTable
            fieldKey={config.key!}
            key={`${groupPath}-${config.key}`}
            onFormChange={(key, value) => onFormChange(key, value, groupPath)}
            placeholder={config.placeholder || 'Select table'}
            type={DirectoriesQueryGroupTypeEnum.exclude_individuals}
            value={
              formData[config.key!] ?? {
                tableId: '',
                tableFieldId: '',
                tableViewId: '',
                keywords: [],
              }
            }
          />
        </QueryCollapse>
      );
    }

    case DirectoriesQueryGroupTypeEnum.additional_details: {
      const filterCount = countFilledFieldsInGroup(config, formData);
      return (
        <QueryCollapse
          defaultOpen={config.isDefaultOpen ?? false}
          filterCount={filterCount}
          isAuth={config.isAuth}
          onClearFilters={onFiltersReset}
          title={config.label}
          tooltip={config.tooltip}
        >
          <QueryAdditionalDetails isAuth={config.isAuth} />
        </QueryCollapse>
      );
    }
  }

  // ============================================
  // Section 2: Form Elements (actionType)
  // ============================================
  switch (config.actionType) {
    case DirectoriesQueryActionTypeEnum.click:
      if (!config.children || config.children.length === 0) {
        return null;
      }
      return (
        <Stack gap={2}>
          {config.children.map((child: DirectoriesQueryItem) => (
            <CreateQueryElement
              config={child}
              disabledLoading={disabledLoading}
              formData={formData}
              groupPath={groupPath}
              key={child.key || child.label || ''}
              onFormChange={onFormChange}
            />
          ))}
        </Stack>
      );

    case DirectoriesQueryActionTypeEnum.select: {
      // Build requestParams for cascade autocomplete (e.g. AUTO_COMPLETE_LOCATION)
      // config.cascadeKey: the field to read value from formData (e.g., 'countryOrRegion')
      // config.requestParams: the param names to send in API request (e.g., ['parentValue'])
      let selectRequestParams: Record<string, string[]> | undefined;
      if (config.cascadeKey && config.requestParams?.length) {
        const cascadeValue = formData[config.cascadeKey];
        if (Array.isArray(cascadeValue) && cascadeValue.length > 0) {
          selectRequestParams = {
            [config.requestParams[0]]: cascadeValue,
          };
        }
      }

      switch (config.componentName) {
        case DirectoriesQueryComponentNameEnum.cascade_select:
          return (
            <QueryContainer
              description={config.description}
              isAuth={containerIsAuth}
              label={config.label}
              tooltip={config.tooltip}
            >
              <QueryCascadeSelect
                onFormChange={(newValue) =>
                  onFormChange?.(config.key, newValue, groupPath)
                }
                placeholder={config.placeholder || ''}
                requestParams={selectRequestParams}
                url={config.url}
                value={formData[config.key!] ?? []}
              />
            </QueryContainer>
          );
        case DirectoriesQueryComponentNameEnum.cascade_select_dynamic:
          return (
            <QueryContainer
              description={config.description}
              isAuth={containerIsAuth}
              label={config.label}
              tooltip={config.tooltip}
            >
              <QueryCascadeSelectExternal
                onFormChange={(newValue) =>
                  onFormChange?.(config.key, newValue, groupPath)
                }
                placeholder={config.placeholder || ''}
                url={null}
                useMockData
                value={formData[config.key!] ?? []}
              />
            </QueryContainer>
          );
        default:
          return (
            <QueryContainer
              description={config.description}
              isAuth={containerIsAuth}
              label={config.label}
              tooltip={config.tooltip}
            >
              <QueryAutoComplete
                freeSolo={false}
                isAuth={config.isAuth}
                isShowRemark={
                  config.componentName ===
                  DirectoriesQueryComponentNameEnum.auto_complete_location
                }
                multiple={config.optionMultiple}
                onFormChange={(newValue: string[] | string | null) =>
                  onFormChange?.(config.key, newValue, groupPath)
                }
                options={config.optionValues || []}
                placeholder={config.placeholder || ''}
                requestParams={selectRequestParams}
                url={config.url}
                value={
                  formData[config.key!] ?? (config.optionMultiple ? [] : '')
                }
              />
            </QueryContainer>
          );
      }
    }

    case DirectoriesQueryActionTypeEnum.input: {
      if (config.inputType === DirectoriesQueryInputTypeEnum.number) {
        return (
          <QueryContainer
            description={config.description}
            isAuth={containerIsAuth}
            label={config.label}
            tooltip={config.tooltip}
          >
            <StyledTextFieldNumber
              maxLength={config.maxLength ?? 0}
              notAllowZero={config.notAllowZero ?? false}
              onValueChange={({ floatValue }) => {
                onFormChange?.(config.key, floatValue, groupPath);
              }}
              placeholder={config.placeholder || ''}
              size={'small'}
              sx={{
                '& .MuiInputBase-root:hover': {
                  bgcolor: 'background.active',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'border.default',
                  },
                },
              }}
              value={formData[config.key!] ?? ''}
            />
          </QueryContainer>
        );
      }
      // Default: QueryAutoComplete (freeSolo=true)
      // Build requestParams for cascade autocomplete
      let inputRequestParams: Record<string, string[]> | undefined;
      if (config.cascadeKey && config.requestParams?.length) {
        const cascadeValue = formData[config.cascadeKey];
        if (Array.isArray(cascadeValue) && cascadeValue.length > 0) {
          inputRequestParams = {
            [config.requestParams[0]]: cascadeValue,
          };
        }
      }

      return (
        <QueryContainer
          description={config.description}
          isAuth={containerIsAuth}
          label={config.label}
          tooltip={config.tooltip}
        >
          <QueryAutoComplete
            freeSolo={true}
            isAuth={config.isAuth}
            isShowRemark={
              config.componentName ===
              DirectoriesQueryComponentNameEnum.auto_complete_location
            }
            multiple={config.optionMultiple}
            onFormChange={(newValue: string[] | string | null) =>
              onFormChange?.(config.key, newValue, groupPath)
            }
            options={config.optionValues || []}
            placeholder={config.placeholder || ''}
            requestParams={inputRequestParams}
            url={config.url}
            value={formData[config.key!] ?? (config.optionMultiple ? [] : '')}
          />
        </QueryContainer>
      );
    }

    case DirectoriesQueryActionTypeEnum.checkbox: {
      const isChecked = formData[config.key!] || false;
      return (
        <QueryContainer isAuth={containerIsAuth}>
          <QueryCheckbox
            onFormChange={(checked) =>
              onFormChange?.(config.key, checked, groupPath)
            }
            subDescription={config.subDescription}
            subLabel={config.subLabel}
            subTooltip={config.subTooltip || '123'}
            value={isChecked}
          />
        </QueryContainer>
      );
    }

    case DirectoriesQueryActionTypeEnum.date:
      if (
        config.componentName ===
        DirectoriesQueryComponentNameEnum.date_range_select
      ) {
        return (
          <QueryContainer
            description={config.description}
            isAuth={containerIsAuth}
            label={config.label}
            tooltip={config.tooltip}
          >
            <QueryDateSelectRange
              formValue={formData[config.key!]}
              isAuth={config.isAuth}
              onFormChange={(value) =>
                onFormChange(config.key, value, groupPath)
              }
              options={config.optionValues}
              placeholder={config.placeholder || 'Select date range'}
            />
          </QueryContainer>
        );
      }
      return null;

    case DirectoriesQueryActionTypeEnum.switch:
      return (
        <QueryContainer
          description={config.description}
          isAuth={containerIsAuth}
          tooltip={config.tooltip}
        >
          <QuerySwitch
            checked={formData[config.key!] || false}
            label={config.label || ''}
            onFormChange={(e, checked) =>
              onFormChange?.(config.key, checked, groupPath)
            }
          />
        </QueryContainer>
      );
  }

  // ============================================
  // Fallback
  // ============================================
  // eslint-disable-next-line no-console
  console.warn('Unknown config:', config);
  return null;
};

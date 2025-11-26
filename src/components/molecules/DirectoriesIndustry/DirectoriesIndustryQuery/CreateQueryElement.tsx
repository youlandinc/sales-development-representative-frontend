import { FC } from 'react';
import { Stack } from '@mui/material';

import { StyledButtonGroup, StyledTextFieldNumber } from '@/components/atoms';
import {
  QueryAdditionalDetails,
  QueryAutoComplete,
  QueryCheckbox,
  QueryCollapse,
  QueryContainer,
  QuerySwitch,
  QueryTab,
  QueryTable,
  QueryTableWithList,
} from './base';
import {
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryGroupTypeEnum,
  DirectoriesQueryInputTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';
import { countFilledFieldsInGroup } from '@/utils/directories';

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
}

export const CreateQueryElement: FC<CreateQueryElementProps> = ({
  config,
  formData,
  onFormChange,
  groupPath,
  disabledLoading = false,
}) => {
  if (config.groupType === DirectoriesQueryGroupTypeEnum.button_group) {
    return (
      <QueryContainer
        isAuth={config.isAuth}
        label={config.label}
        labelSx={{ fontWeight: 600, fontSize: 14 }}
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
  }

  // TAB - Tab 切换布局
  if (config.groupType === DirectoriesQueryGroupTypeEnum.tab) {
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
              formData={tabGroupPath ? formData[tabGroupPath] || {} : formData}
              groupPath={tabGroupPath}
              key={child.key || child.label || ''}
              onFormChange={onFormChange}
            />
          );
        }}
        value={config.key ? formData[config.key] : null}
      />
    );
  }

  // GENERAL - 不受权限影响
  if (config.groupType === DirectoriesQueryGroupTypeEnum.general) {
    const filterCount = countFilledFieldsInGroup(config, formData);

    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        filterCount={filterCount}
        isAuth={config.isAuth}
        title={config.label}
      >
        {config.children && config.children.length > 0
          ? config.children.map((child: DirectoriesQueryItem) => (
              <CreateQueryElement
                config={child}
                formData={formData}
                groupPath={groupPath}
                key={child.key || child.label || ''}
                onFormChange={onFormChange}
              />
            ))
          : null}
      </QueryCollapse>
    );
  }

  // EXCLUDE_FIRMS
  if (config.groupType === DirectoriesQueryGroupTypeEnum.exclude_firms) {
    const filterCount = countFilledFieldsInGroup(config, formData);

    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        filterCount={filterCount}
        isAuth={config.isAuth}
        title={config.label}
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

  // EXCLUDE_INDIVIDUALS - 不受权限影响
  if (config.groupType === DirectoriesQueryGroupTypeEnum.exclude_individuals) {
    const filterCount = countFilledFieldsInGroup(config, formData);

    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        filterCount={filterCount}
        isAuth={config.isAuth}
        title={config.label}
      >
        <QueryTable
          fieldKey={config.key!}
          key={`${groupPath}-${config.key}`}
          onFormChange={(key, value) => onFormChange(key, value, groupPath)}
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

  // ADDITIONAL_DETAILS
  if (config.groupType === DirectoriesQueryGroupTypeEnum.additional_details) {
    const filterCount = countFilledFieldsInGroup(config, formData);

    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        filterCount={filterCount}
        isAuth={config.isAuth}
        title={config.label}
      >
        <QueryAdditionalDetails isAuth={config.isAuth} />
      </QueryCollapse>
    );
  }

  if (config.actionType === DirectoriesQueryActionTypeEnum.click) {
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
  }

  //（QueryAutoComplete freeSolo=false）
  if (config.actionType === DirectoriesQueryActionTypeEnum.select) {
    return (
      <QueryContainer
        description={config.description}
        isAuth={config.isAuth}
        label={config.label}
      >
        <QueryAutoComplete
          freeSolo={false}
          isAuth={config.isAuth}
          multiple={config.optionMultiple}
          onFormChange={(newValue: string[] | string | null) =>
            onFormChange?.(config.key, newValue, groupPath)
          }
          options={config.optionValues || []}
          placeholder={config.placeholder || ''}
          url={config.url}
          value={formData[config.key!] ?? (config.optionMultiple ? [] : '')}
        />
      </QueryContainer>
    );
  }

  if (config.actionType === DirectoriesQueryActionTypeEnum.input) {
    if (config.inputType === DirectoriesQueryInputTypeEnum.number) {
      return (
        <QueryContainer
          description={config.description}
          isAuth={config.isAuth}
          label={config.label}
        >
          <StyledTextFieldNumber
            onValueChange={({ value }) =>
              onFormChange?.(config.key, value, groupPath)
            }
            placeholder={config.placeholder || ''}
            value={formData[config.key!] ?? ''}
          />
        </QueryContainer>
      );
    }

    // QueryAutoComplete (freeSolo=true)
    return (
      <QueryContainer
        description={config.description}
        isAuth={config.isAuth}
        label={config.label}
      >
        <QueryAutoComplete
          freeSolo={true}
          isAuth={config.isAuth}
          multiple={config.optionMultiple}
          onFormChange={(newValue: string[] | string | null) =>
            onFormChange?.(config.key, newValue, groupPath)
          }
          options={config.optionValues || []}
          placeholder={config.placeholder || ''}
          url={config.url}
          value={formData[config.key!] ?? (config.optionMultiple ? [] : '')}
        />
      </QueryContainer>
    );
  }

  if (config.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
    const isChecked = formData[config.key!] || false;

    return (
      <QueryContainer description={config.description} isAuth={config.isAuth}>
        <QueryCheckbox
          onFormChange={(checked) =>
            onFormChange?.(config.key, checked, groupPath)
          }
          subLabel={config.subLabel}
          value={isChecked}
        />
      </QueryContainer>
    );
  }

  // SWITCH
  if (config.actionType === DirectoriesQueryActionTypeEnum.switch) {
    return (
      <QueryContainer description={config.description} isAuth={config.isAuth}>
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

  //eslint-disable-next-line
  console.warn('Unknown config:', config);
  return null;
};

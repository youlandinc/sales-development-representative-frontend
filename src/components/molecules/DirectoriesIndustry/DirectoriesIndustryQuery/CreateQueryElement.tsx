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
} from '@/types/Directories/query';

interface CreateQueryElementProps {
  config: DirectoriesQueryItem;
  formData: any; // 整个表单数据对象
  onFormChange: (
    key: string | undefined | null,
    newValue: any,
    groupPath?: string,
  ) => void;
  groupPath?: string; // 当前分组路径（如 'FIRM', 'EXECUTIVE'）
  disabledLoading?: boolean; // Loading 状态导致的禁用
  disabledPermission?: boolean; // 权限导致的禁用（planType, isAuth）
}

export const CreateQueryElement: FC<CreateQueryElementProps> = ({
  config,
  formData,
  onFormChange,
  groupPath,
  disabledLoading = false,
  disabledPermission = false,
}) => {
  // 组合最终的 disabled 状态
  const isDisabled = disabledLoading || disabledPermission;

  if (config.groupType === DirectoriesQueryGroupTypeEnum.button_group) {
    return (
      <QueryContainer
        label={config.label}
        labelSx={{ fontWeight: 600, fontSize: 14 }}
      >
        <StyledButtonGroup
          disabled={isDisabled}
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
                disabledPermission={disabledPermission}
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
              disabledPermission={disabledPermission}
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

  // GENERAL - 可折叠分组
  if (config.groupType === DirectoriesQueryGroupTypeEnum.general) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
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

  // EXCLUDE_FIRMS - 排除公司（带列表选项）
  if (config.groupType === DirectoriesQueryGroupTypeEnum.exclude_firms) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        title={config.label}
      >
        <QueryTableWithList
          fieldKey={config.key!}
          key={`${groupPath}-${config.key}`}
          onFormChange={(key, value) => onFormChange(key, value, groupPath)}
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

  // EXCLUDE_INDIVIDUALS - 排除个人（仅表格选择）
  if (config.groupType === DirectoriesQueryGroupTypeEnum.exclude_individuals) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
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

  // ADDITIONAL_DETAILS - 附加详情（组件内部从 store 获取数据）
  if (config.groupType === DirectoriesQueryGroupTypeEnum.additional_details) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? false}
        title={config.label}
      >
        <QueryAdditionalDetails />
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
            disabledPermission={disabledPermission}
            formData={formData}
            groupPath={groupPath}
            key={child.key || child.label || ''}
            onFormChange={onFormChange}
          />
        ))}
      </Stack>
    );
  }

  // SELECT - 下拉选择（QueryAutoComplete freeSolo=false）
  if (config.actionType === DirectoriesQueryActionTypeEnum.select) {
    return (
      <QueryContainer description={config.description} label={config.label}>
        <QueryAutoComplete
          freeSolo={false}
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

  // INPUT - 输入框
  if (config.actionType === DirectoriesQueryActionTypeEnum.input) {
    // 数字类型输入框 - 使用 StyledTextFieldNumber
    if (config.inputType === DirectoriesQueryInputTypeEnum.number) {
      return (
        <QueryContainer description={config.description} label={config.label}>
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

    // 文本类型输入框 - 使用 QueryAutoComplete (freeSolo=true)
    return (
      <QueryContainer description={config.description} label={config.label}>
        <QueryAutoComplete
          freeSolo={true}
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

  // CHECKBOX - 简单复选框（无子项，子项由 groupType 处理）
  if (config.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
    const isChecked = formData[config.key!] || false;

    return (
      <QueryContainer description={config.description}>
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

  // SWITCH - 开关
  if (config.actionType === DirectoriesQueryActionTypeEnum.switch) {
    return (
      <QueryContainer description={config.description}>
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

  // 未知类型警告
  console.warn('Unknown config:', config);
  return null;
};

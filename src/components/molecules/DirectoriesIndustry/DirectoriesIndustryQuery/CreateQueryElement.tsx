import { FC } from 'react';
import { Stack } from '@mui/material';

import { StyledButtonGroup, StyledTextFieldNumber } from '@/components/atoms';
import {
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
}

export const CreateQueryElement: FC<CreateQueryElementProps> = ({
  config,
  formData,
  onFormChange,
  groupPath,
}) => {
  // ========================================
  // 优先级1: 处理 groupType（容器/布局）
  // ========================================

  // BUTTON_GROUP - 按钮组切换
  if (config.groupType === DirectoriesQueryGroupTypeEnum.button_group) {
    return (
      <QueryContainer label={config.label || undefined}>
        <StyledButtonGroup
          onChange={(event, newValue) => {
            // BUTTON_GROUP 必须有值，忽略空值
            if (newValue) {
              onFormChange?.(config.key, newValue, groupPath);
            }
          }}
          options={config.optionValues || []}
          value={formData[config.key!] || ''}
        />
        {config.children && config.children.length > 0 && (
          <Stack gap={2} sx={{ mt: 1.5 }}>
            {config.children.map((child: DirectoriesQueryItem) => (
              <CreateQueryElement
                config={child}
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
      <QueryContainer title={config.label || undefined}>
        <QueryTab
          config={config}
          onFormChange={(newValue) =>
            onFormChange?.(config.key, newValue, groupPath)
          }
          renderChild={(child, childIndex) => {
            const optionValue = config.optionValues?.[childIndex];
            const tabGroupPath = optionValue?.value || groupPath || '';

            return (
              <CreateQueryElement
                config={child}
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
      </QueryContainer>
    );
  }

  // GENERAL - 可折叠分组
  if (config.groupType === DirectoriesQueryGroupTypeEnum.general) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? true}
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
          value={formData[config.key!]}
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
          value={formData[config.key!]}
        />
      </QueryCollapse>
    );
  }

  // ADDITIONAL_DETAILS - 附加详情（内部自己处理子项）
  if (config.groupType === DirectoriesQueryGroupTypeEnum.additional_details) {
    return (
      <QueryCollapse
        defaultOpen={config.isDefaultOpen ?? true}
        title={config.label}
      >
        {/* TBD: QueryAdditionalDetails 组件，接收 children、formData、onFormChange */}
        <div>Additional Details - TBD</div>
      </QueryCollapse>
    );
  }

  // ========================================
  // 优先级2: 处理 actionType（表单控件）
  // ========================================

  // CLICK - 仅作为容器渲染 children
  if (config.actionType === DirectoriesQueryActionTypeEnum.click) {
    if (!config.children || config.children.length === 0) {
      return null;
    }
    return (
      <Stack gap={2}>
        {config.children.map((child: DirectoriesQueryItem) => (
          <CreateQueryElement
            config={child}
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
      <QueryContainer
        description={config.description || undefined}
        label={config.label || undefined}
      >
        <QueryAutoComplete
          freeSolo={false}
          multiple={config.optionMultiple}
          onFormChange={(newValue: string[] | string | null) =>
            onFormChange?.(config.key, newValue, groupPath)
          }
          options={config.optionValues || []}
          placeholder={config.placeholder || ''}
          url={config.url}
          value={formData[config.key!] || (config.optionMultiple ? [] : '')}
        />
      </QueryContainer>
    );
  }

  // INPUT - 输入框
  if (config.actionType === DirectoriesQueryActionTypeEnum.input) {
    // 数字类型输入框 - 使用 StyledTextFieldNumber
    if (config.inputType === DirectoriesQueryInputTypeEnum.number) {
      return (
        <QueryContainer
          description={config.description || undefined}
          label={config.label || undefined}
        >
          <StyledTextFieldNumber
            onValueChange={({ value }) =>
              onFormChange?.(config.key, value, groupPath)
            }
            placeholder={config.placeholder || ''}
            value={formData[config.key!] || ''}
          />
        </QueryContainer>
      );
    }

    // 文本类型输入框 - 使用 QueryAutoComplete (freeSolo=true)
    return (
      <QueryContainer
        description={config.description || undefined}
        label={config.label || undefined}
      >
        <QueryAutoComplete
          freeSolo={true}
          multiple={config.optionMultiple}
          onFormChange={(newValue: string[] | string | null) =>
            onFormChange?.(config.key, newValue, groupPath)
          }
          options={config.optionValues || []}
          placeholder={config.placeholder || ''}
          url={config.url}
          value={formData[config.key!] || (config.optionMultiple ? [] : '')}
        />
      </QueryContainer>
    );
  }

  // CHECKBOX - 简单复选框（无子项，子项由 groupType 处理）
  if (config.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
    const isChecked = formData[config.key!] || false;

    return (
      <QueryContainer description={config.description || undefined}>
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
      <QueryContainer description={config.description || undefined}>
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

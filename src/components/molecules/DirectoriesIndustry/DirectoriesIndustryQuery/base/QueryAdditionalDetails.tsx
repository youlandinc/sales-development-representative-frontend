import { FC } from 'react';
import { Box, Divider, Stack } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import {
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryItem,
} from '@/types/Directories';

import { StyledCheckbox } from '@/components/atoms';
import { QueryAutoComplete } from './index';

export const QueryAdditionalDetails: FC = () => {
  // 从 store 获取数据
  const config = useDirectoriesStore((state) => state.additionalDetailsConfig);
  const checkbox = useDirectoriesStore(
    (state) => state.additionalDetailsCheckbox,
  );
  const values = useDirectoriesStore((state) => state.additionalDetailsValues);
  const updateAdditionalSelection = useDirectoriesStore(
    (state) => state.updateAdditionalSelection,
  );

  // 递归收集所有 CHECKBOX 类型的 keys（不包括 SELECT）
  const collectChildKeys = (children: DirectoriesQueryItem[]): string[] => {
    const keys: string[] = [];
    children.forEach((child) => {
      // 只收集 CHECKBOX 类型的 key
      if (
        child.key &&
        child.actionType === DirectoriesQueryActionTypeEnum.checkbox
      ) {
        keys.push(child.key);
      }
      // 递归处理子节点
      if (child.children) {
        keys.push(...collectChildKeys(child.children));
      }
    });
    return keys;
  };

  const renderItem = (item: DirectoriesQueryItem) => {
    const itemKey = item.key;

    if (item.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
      // 计算选中状态和 indeterminate 状态
      let isChecked = false;
      let indeterminate = false;

      if (itemKey) {
        // 有 key：从 checkbox 状态中获取
        isChecked = Boolean(checkbox[itemKey]);
      } else if (item.children) {
        // 无 key（分组）：检查 children 状态
        const childKeys = collectChildKeys(item.children);
        const checkedCount = childKeys.filter((key) =>
          Boolean(checkbox[key]),
        ).length;

        if (checkedCount === childKeys.length && childKeys.length > 0) {
          // 全选
          isChecked = true;
          indeterminate = false;
        } else if (checkedCount > 0) {
          // 部分选中
          isChecked = false;
          indeterminate = true;
        } else {
          // 全不选
          isChecked = false;
          indeterminate = false;
        }
      }

      if (item.children && item.children.length > 0) {
        return (
          <Stack key={itemKey || item.label} sx={{ gap: 1 }}>
            {/* 父级 checkbox */}
            <StyledCheckbox
              checked={isChecked}
              indeterminate={indeterminate}
              label={item.subLabel || item.label || ''}
              onChange={(_, checked) => {
                updateAdditionalSelection(itemKey, checked, item);
              }}
            />

            {/* 如果选中了或部分选中，渲染子项 */}
            {(isChecked || indeterminate) && (
              <Stack sx={{ pl: 3, gap: 1 }}>
                {item.children.map((child) => renderItem(child))}
              </Stack>
            )}
          </Stack>
        );
      }

      // 独立的 checkbox（必须有 key）
      if (!itemKey) {
        console.warn('Checkbox without key and children:', item.label);
        return null;
      }

      return (
        <Stack key={itemKey}>
          <StyledCheckbox
            checked={isChecked}
            label={item.subLabel || item.label || ''}
            onChange={(_, checked) => {
              updateAdditionalSelection(itemKey, checked, item);
            }}
          />
        </Stack>
      );
    }

    if (item.actionType === DirectoriesQueryActionTypeEnum.select) {
      // SELECT 必须有 key
      if (!itemKey) {
        console.warn('Select without key:', item.label);
        return null;
      }

      // 从 values 状态中获取值
      const rawValue = values[itemKey];
      const isMultiple = item.optionMultiple ?? false;

      // 根据 multiple 类型，条件渲染不同的组件
      if (isMultiple) {
        // Multiple select
        const safeValue = Array.isArray(rawValue) ? rawValue : [];
        return (
          <Stack key={itemKey} mb={1}>
            <QueryAutoComplete
              multiple={true}
              onFormChange={(newValue: string[]) => {
                updateAdditionalSelection(itemKey, newValue, item);
              }}
              options={item.optionValues ?? []}
              placeholder={item.placeholder ?? undefined}
              value={safeValue}
            />
          </Stack>
        );
      }
      // Single select
      const safeValue = typeof rawValue === 'string' ? rawValue : null;
      return (
        <Stack key={itemKey} mb={1}>
          <QueryAutoComplete
            multiple={false}
            onFormChange={(newValue: string | null) => {
              updateAdditionalSelection(itemKey, newValue, item);
            }}
            options={item.optionValues ?? []}
            placeholder={item.placeholder ?? undefined}
            value={safeValue}
          />
        </Stack>
      );
    }

    return null;
  };

  if (!config || config.length === 0) {
    return (
      <Box sx={{ color: 'text.secondary' }}>
        No additional details available
      </Box>
    );
  }

  return (
    <Stack sx={{ gap: 2.25 }}>
      {config.map((item, index) => (
        <Stack key={item.key || item.label || index} sx={{ gap: 1 }}>
          {renderItem(item)}
          {index < config.length - 1 && (
            <Divider sx={{ borderColor: '#DFDEE6' }} />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

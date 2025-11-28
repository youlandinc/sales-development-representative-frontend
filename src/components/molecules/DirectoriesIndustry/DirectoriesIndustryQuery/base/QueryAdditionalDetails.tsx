import { FC } from 'react';
import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { UTypeOf } from '@/utils/UTypeOf';

import { useDirectoriesStore } from '@/stores/directories';
import {
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';

import { StyledCheckbox } from '@/components/atoms';
import { QueryAutoComplete } from './index';

interface QueryAdditionalDetailsProps {
  isAuth: boolean;
}

export const QueryAdditionalDetails: FC<QueryAdditionalDetailsProps> = ({
  isAuth = true,
}) => {
  const {
    config,
    checkbox,
    values,
    isLoadingAdditional,
    updateAdditionalSelection,
  } = useDirectoriesStore(
    useShallow((state) => ({
      config: state.additionalConfig,
      checkbox: state.additionalCheckbox,
      values: state.additionalValues,
      isLoadingAdditional: state.isLoadingAdditional,
      updateAdditionalSelection: state.updateAdditionalSelection,
    })),
  );

  const collectChildKeys = (children: DirectoriesQueryItem[]): string[] => {
    const keys: string[] = [];
    children.forEach((child) => {
      if (
        child.key &&
        child.actionType === DirectoriesQueryActionTypeEnum.checkbox
      ) {
        keys.push(child.key);
      }
      if (child.children) {
        keys.push(...collectChildKeys(child.children));
      }
    });
    return keys;
  };

  const renderItem = (item: DirectoriesQueryItem) => {
    const itemKey = item.key;

    if (item.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
      let isChecked = false;
      let indeterminate = false;

      if (itemKey) {
        isChecked = Boolean(checkbox[itemKey]);
      } else if (item.children) {
        const childKeys = collectChildKeys(item.children);
        const checkedCount = childKeys.filter((key) =>
          Boolean(checkbox[key]),
        ).length;

        if (checkedCount === childKeys.length && childKeys.length > 0) {
          isChecked = true;
          indeterminate = false;
        } else if (checkedCount > 0) {
          isChecked = false;
          indeterminate = true;
        } else {
          isChecked = false;
          indeterminate = false;
        }
      }

      if (item.children && item.children.length > 0) {
        // When isAuth=false: always expand children, but disabled
        const shouldShowChildren = !isAuth || isChecked || indeterminate;

        return (
          <Stack key={itemKey || item.label} sx={{ gap: 1 }}>
            <StyledCheckbox
              checked={!isAuth || isChecked}
              disabled={!isAuth}
              indeterminate={isAuth && indeterminate}
              label={item.subLabel || item.label || ''}
              onChange={(_, checked) => {
                updateAdditionalSelection(itemKey, checked, item);
              }}
            />

            {shouldShowChildren && (
              <Stack sx={{ pl: 3, gap: 1 }}>
                {item.children.map((child) => renderItem(child))}
              </Stack>
            )}
          </Stack>
        );
      }

      if (!itemKey) {
        //console.warn('Checkbox without key and children:', item.label);
        return null;
      }

      return (
        <Stack key={itemKey}>
          <StyledCheckbox
            checked={!isAuth || isChecked}
            disabled={!isAuth}
            label={item.subLabel || item.label || ''}
            onChange={(_, checked) => {
              updateAdditionalSelection(itemKey, checked, item);
            }}
          />
        </Stack>
      );
    }

    if (item.actionType === DirectoriesQueryActionTypeEnum.select) {
      if (!itemKey) {
        //console.warn('Select without key:', item.label);
        return null;
      }

      const rawValue = values[itemKey];
      const isMultiple = item.optionMultiple ?? false;

      if (isMultiple) {
        const safeValue = Array.isArray(rawValue) ? rawValue : [];
        return (
          <Stack key={itemKey} mb={1}>
            <QueryAutoComplete
              isAuth={isAuth}
              multiple={true}
              onFormChange={(newValue: string[]) => {
                updateAdditionalSelection(itemKey, newValue, item);
              }}
              options={item.optionValues ?? []}
              placeholder={item.placeholder ?? undefined}
              url={item.url}
              value={safeValue}
            />
          </Stack>
        );
      }

      const safeValue = UTypeOf.isString(rawValue) ? rawValue : null;
      return (
        <Stack key={itemKey} mb={1}>
          <QueryAutoComplete
            isAuth={isAuth}
            multiple={false}
            onFormChange={(newValue: string | null) => {
              updateAdditionalSelection(itemKey, newValue, item);
            }}
            options={item.optionValues ?? []}
            placeholder={item.placeholder ?? undefined}
            url={item.url}
            value={safeValue}
          />
        </Stack>
      );
    }

    return null;
  };

  if (isLoadingAdditional) {
    return (
      <Stack sx={{ gap: 2 }}>
        <Skeleton animation="wave" height={18} variant="rounded" />
        <Skeleton animation="wave" height={18} variant="rounded" />
        <Skeleton animation="wave" height={18} variant="rounded" />
      </Stack>
    );
  }

  if (!config || config.length === 0) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          gap: 1,
        }}
      >
        <Typography
          sx={{ fontSize: 14, fontWeight: 600, color: 'text.secondary' }}
        >
          No additional details available
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
          Try adjusting your filters to see more options
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: 2.25, mt: 1 }}>
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

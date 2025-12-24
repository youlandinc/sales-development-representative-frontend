import { useCallback, useMemo } from 'react';

import { CascadeOption } from './useCascadeOptions';

interface UseCascadeSelectionParams {
  value: string[];
  getChildren: (parentId: number | null) => CascadeOption[];
  onFormChange: (newValue: string[]) => void;
}

export const useCascadeSelection = ({
  value,
  getChildren,
  onFormChange,
}: UseCascadeSelectionParams) => {
  // Get all descendant leaf values for a parent
  const getAllDescendantValues = useCallback(
    (parentId: number): string[] => {
      const result: string[] = [];
      const collectDescendants = (pid: number) => {
        const children = getChildren(pid);
        children.forEach((child) => {
          result.push(child.value);
          collectDescendants(child.id);
        });
      };
      collectDescendants(parentId);
      return result;
    },
    [getChildren],
  );

  // Expand external value: if parent value exists, expand to all descendants
  // This is the "internal" representation used for UI display
  const expandedValues = useMemo(() => {
    const result: string[] = [];
    const rootOptions = getChildren(null);

    value.forEach((v) => {
      // Check if this value is a parent (root level)
      const matchedRoot = rootOptions.find((root) => root.value === v);
      if (matchedRoot) {
        // Expand parent to all descendants
        const descendants = getAllDescendantValues(matchedRoot.id);
        result.push(...descendants);
      } else {
        // Keep leaf value as is
        result.push(v);
      }
    });

    return result;
  }, [value, getChildren, getAllDescendantValues]);

  // Set for quick lookup of expanded values
  const valueSet = useMemo(() => new Set(expandedValues), [expandedValues]);

  // Aggregate values: collapse all selected children to parent value
  const aggregateValues = useCallback(
    (rawValues: string[]): string[] => {
      const rawSet = new Set(rawValues);
      const result: string[] = [];
      const processedValues = new Set<string>();

      const rootOptions = getChildren(null);
      rootOptions.forEach((root) => {
        const descendants = getAllDescendantValues(root.id);
        if (descendants.length > 0) {
          const isAllDescendantsSelected = descendants.every((v) =>
            rawSet.has(v),
          );
          if (isAllDescendantsSelected) {
            result.push(root.value);
            descendants.forEach((v) => processedValues.add(v));
          }
        }
      });

      rawValues.forEach((v) => {
        if (!processedValues.has(v)) {
          result.push(v);
        }
      });

      return result;
    },
    [getChildren, getAllDescendantValues],
  );

  // Toggle option using expanded values, then aggregate before calling onFormChange
  const onToggleOption = useCallback(
    (optionValue: string) => {
      let newExpandedValues: string[];
      if (valueSet.has(optionValue)) {
        newExpandedValues = expandedValues.filter((v) => v !== optionValue);
      } else {
        newExpandedValues = [...expandedValues, optionValue];
      }
      const aggregated = aggregateValues(newExpandedValues);
      onFormChange(aggregated);
    },
    [valueSet, expandedValues, aggregateValues, onFormChange],
  );

  // Change with aggregate: for parent checkbox toggle
  const onChangeWithAggregate = useCallback(
    (newExpandedValues: string[]) => {
      const aggregated = aggregateValues(newExpandedValues);
      onFormChange(aggregated);
    },
    [aggregateValues, onFormChange],
  );

  return {
    valueSet,
    expandedValues,
    getAllDescendantValues,
    onToggleOption,
    onChangeWithAggregate,
  };
};

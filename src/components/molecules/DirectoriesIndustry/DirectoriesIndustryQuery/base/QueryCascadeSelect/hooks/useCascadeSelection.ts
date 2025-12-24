import { useCallback, useMemo } from 'react';

import { CascadeOption } from './useCascadeOptions';

interface UseCascadeSelectionParams {
  value: number[];
  getChildren: (parentId: number | null) => CascadeOption[];
  onFormChange: (newValue: number[]) => void;
}

export const useCascadeSelection = ({
  value,
  getChildren,
  onFormChange,
}: UseCascadeSelectionParams) => {
  // Get all descendant ids for a parent
  const getAllDescendantIds = useCallback(
    (parentId: number): number[] => {
      const result: number[] = [];
      const collectDescendants = (pid: number) => {
        const children = getChildren(pid);
        children.forEach((child) => {
          result.push(child.id);
          collectDescendants(child.id);
        });
      };
      collectDescendants(parentId);
      return result;
    },
    [getChildren],
  );

  // Expand external value: if parent id exists, expand to all descendants
  // This is the "internal" representation used for UI display
  const expandedIds = useMemo(() => {
    const result: number[] = [];
    const rootOptions = getChildren(null);

    value.forEach((id) => {
      // Check if this id is a parent (root level)
      const matchedRoot = rootOptions.find((root) => root.id === id);
      if (matchedRoot) {
        // Expand parent to all descendants
        const descendants = getAllDescendantIds(matchedRoot.id);
        result.push(...descendants);
      } else {
        // Keep leaf id as is
        result.push(id);
      }
    });

    return result;
  }, [value, getChildren, getAllDescendantIds]);

  // Set for quick lookup of expanded ids
  const idSet = useMemo(() => new Set(expandedIds), [expandedIds]);

  // Aggregate ids: collapse all selected children to parent id
  const aggregateIds = useCallback(
    (rawIds: number[]): number[] => {
      const rawSet = new Set(rawIds);
      const result: number[] = [];
      const processedIds = new Set<number>();

      const rootOptions = getChildren(null);
      rootOptions.forEach((root) => {
        const descendants = getAllDescendantIds(root.id);
        if (descendants.length > 0) {
          const isAllDescendantsSelected = descendants.every((id) =>
            rawSet.has(id),
          );
          if (isAllDescendantsSelected) {
            result.push(root.id);
            descendants.forEach((id) => processedIds.add(id));
          }
        }
      });

      rawIds.forEach((id) => {
        if (!processedIds.has(id)) {
          result.push(id);
        }
      });

      return result;
    },
    [getChildren, getAllDescendantIds],
  );

  // Toggle option using expanded ids, then aggregate before calling onFormChange
  const onToggleOption = useCallback(
    (optionId: number) => {
      let newExpandedIds: number[];
      if (idSet.has(optionId)) {
        newExpandedIds = expandedIds.filter((id) => id !== optionId);
      } else {
        newExpandedIds = [...expandedIds, optionId];
      }
      const aggregated = aggregateIds(newExpandedIds);
      onFormChange(aggregated);
    },
    [idSet, expandedIds, aggregateIds, onFormChange],
  );

  // Change with aggregate: for parent checkbox toggle
  const onChangeWithAggregate = useCallback(
    (newExpandedIds: number[]) => {
      const aggregated = aggregateIds(newExpandedIds);
      onFormChange(aggregated);
    },
    [aggregateIds, onFormChange],
  );

  return {
    idSet,
    expandedIds,
    getAllDescendantIds,
    onToggleOption,
    onChangeWithAggregate,
  };
};

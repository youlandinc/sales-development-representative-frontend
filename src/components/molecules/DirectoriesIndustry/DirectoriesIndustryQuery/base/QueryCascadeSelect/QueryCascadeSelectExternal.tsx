import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Checkbox,
  ClickAwayListener,
  InputBase,
  Popper,
  Stack,
} from '@mui/material';

import { CascadeOption, useCascadeOptions, useCascadeSelection } from './hooks';
import { QueryIcon } from '../QueryIcons';

export interface QueryCascadeSelectExternalProps {
  url: string | null;
  value?: number[];
  onFormChange: (newValue: number[]) => void;
  requestParams?: Record<string, string[]>;
  placeholder?: string;
  label?: string;
  useMockData?: boolean;
}

// Mock data for testing
const MOCK_CASCADE_OPTIONS: CascadeOption[] = [
  // Parent level
  { id: 1, parentId: null, label: 'ABC', value: 'abc', key: 'abc', sort: 1 },
  { id: 2, parentId: null, label: 'DEFG', value: 'defg', key: 'defg', sort: 2 },
  {
    id: 3,
    parentId: null,
    label: 'HIJKLMN',
    value: 'hijklmn',
    key: 'hijklmn',
    sort: 3,
  },
  {
    id: 4,
    parentId: null,
    label: 'OPQRST',
    value: 'opqrst',
    key: 'opqrst',
    sort: 4,
  },
  // Children of ABC (id: 1)
  {
    id: 11,
    parentId: 1,
    label: 'abc-child-1',
    value: 'abc-child-1',
    key: 'abc-child-1',
    sort: 1,
  },
  {
    id: 12,
    parentId: 1,
    label: 'abc-child-2',
    value: 'abc-child-2',
    key: 'abc-child-2',
    sort: 2,
  },
  // Children of DEFG (id: 2)
  {
    id: 21,
    parentId: 2,
    label: 'defg-child-1',
    value: 'defg-child-1',
    key: 'defg-child-1',
    sort: 1,
  },
  {
    id: 22,
    parentId: 2,
    label: 'defg-child-2',
    value: 'defg-child-2',
    key: 'defg-child-2',
    sort: 2,
  },
  // Children of HIJKLMN (id: 3)
  {
    id: 31,
    parentId: 3,
    label: 'hijklmn',
    value: 'hijklmn-child-1',
    key: 'hijklmn-child-1',
    sort: 1,
  },
  {
    id: 32,
    parentId: 3,
    label: 'abc',
    value: 'hijklmn-child-2',
    key: 'hijklmn-child-2',
    sort: 2,
  },
  {
    id: 33,
    parentId: 3,
    label: 'defg',
    value: 'hijklmn-child-3',
    key: 'hijklmn-child-3',
    sort: 3,
  },
  {
    id: 34,
    parentId: 3,
    label: 'hijklmn',
    value: 'hijklmn-child-4',
    key: 'hijklmn-child-4',
    sort: 4,
  },
  {
    id: 35,
    parentId: 3,
    label: 'hijklmn',
    value: 'hijklmn-child-5',
    key: 'hijklmn-child-5',
    sort: 5,
  },
  // Children of OPQRST (id: 4)
  {
    id: 41,
    parentId: 4,
    label: 'opqrst-child-1',
    value: 'opqrst-child-1',
    key: 'opqrst-child-1',
    sort: 1,
  },
  {
    id: 42,
    parentId: 4,
    label: 'opqrst-child-2',
    value: 'opqrst-child-2',
    key: 'opqrst-child-2',
    sort: 2,
  },
];

const CHIP_CLOSE_ICON = <QueryIcon.Close size={12} />;

// Hook for mock data
const useMockCascadeOptions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [flatOptions, setFlatOptions] = useState<CascadeOption[]>([]);

  const childrenMap = useMemo(() => {
    const map = new Map<number | null, CascadeOption[]>();
    flatOptions.forEach((opt) => {
      const siblings = map.get(opt.parentId) || [];
      siblings.push(opt);
      map.set(opt.parentId, siblings);
    });
    map.forEach((children) => {
      children.sort((a, b) => a.sort - b.sort);
    });
    return map;
  }, [flatOptions]);

  const optionMap = useMemo(() => {
    const map = new Map<string, CascadeOption>();
    flatOptions.forEach((opt) => map.set(opt.value, opt));
    return map;
  }, [flatOptions]);

  const idMap = useMemo(() => {
    const map = new Map<number, CascadeOption>();
    flatOptions.forEach((opt) => map.set(opt.id, opt));
    return map;
  }, [flatOptions]);

  const fetchOptions = useCallback(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setFlatOptions(MOCK_CASCADE_OPTIONS);
      setIsLoading(false);
    }, 800);
  }, []);

  const getChildren = useCallback(
    (parentId: number | null): CascadeOption[] =>
      childrenMap.get(parentId) || [],
    [childrenMap],
  );

  const getPathLabels = useCallback(
    (value: string): string[] => {
      const labels: string[] = [];
      let current = optionMap.get(value);
      while (current) {
        labels.unshift(current.label);
        current = current.parentId ? idMap.get(current.parentId) : undefined;
      }
      return labels;
    },
    [optionMap, idMap],
  );

  return {
    flatOptions,
    isLoading,
    fetchOptions,
    getChildren,
    getPathLabels,
  };
};

export const QueryCascadeSelectExternal: FC<
  QueryCascadeSelectExternalProps
> = ({
  url,
  value = [],
  onFormChange,
  requestParams,
  placeholder = 'Please select',
  label,
  useMockData = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activePath, setActivePath] = useState<number[]>([]);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const realOptions = useCascadeOptions({
    url,
    requestParams,
  });

  const mockOptions = useMockCascadeOptions();

  const { flatOptions, isLoading, fetchOptions, getChildren, getPathLabels } =
    useMockData ? mockOptions : realOptions;

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, fetchOptions]);

  const {
    idSet,
    expandedIds,
    getAllDescendantIds,
    onToggleOption,
    onChangeWithAggregate,
  } = useCascadeSelection({ value, getChildren, onFormChange });

  const searchResults = useMemo(() => {
    if (!searchText.trim()) {
      return null;
    }
    const lowerSearch = searchText.toLowerCase();
    return flatOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lowerSearch),
    );
  }, [searchText, flatOptions]);

  const columns = useMemo(() => {
    if (searchResults) {
      return searchResults.length > 0 ? [searchResults] : [];
    }
    const cols: CascadeOption[][] = [];
    const rootOptions = getChildren(null);
    if (rootOptions.length > 0) {
      cols.push(rootOptions);
    }
    activePath.forEach((parentId) => {
      const children = getChildren(parentId);
      if (children.length > 0) {
        cols.push(children);
      }
    });
    return cols;
  }, [activePath, getChildren, searchResults]);

  const onTriggerClick = useCallback(() => {
    setIsOpen(true);
    inputRef.current?.focus();
  }, []);

  const onPopoverClose = useCallback(() => {
    setIsOpen(false);
    setSearchText('');
    setActivePath([]);
  }, []);

  const onSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
      if (!isOpen) {
        setIsOpen(true);
      }
    },
    [isOpen],
  );

  const onParentOptionClick = useCallback(
    (optionId: number, columnIndex: number) => {
      setActivePath((prev) => [...prev.slice(0, columnIndex), optionId]);
    },
    [],
  );

  const onChipDelete = useCallback(
    (label: string) => {
      const rootOptions = getChildren(null);
      const matchedRoot = rootOptions.find((opt) => opt.label === label);
      if (matchedRoot) {
        const descendants = getAllDescendantIds(matchedRoot.id);
        const toRemove = new Set(descendants);
        const newExpandedIds = expandedIds.filter((id) => !toRemove.has(id));
        onChangeWithAggregate(newExpandedIds);
      } else {
        const matchedOption = flatOptions.find((opt) => opt.label === label);
        if (matchedOption) {
          const newExpandedIds = expandedIds.filter(
            (id) => id !== matchedOption.id,
          );
          onChangeWithAggregate(newExpandedIds);
        }
      }
    },
    [
      getChildren,
      getAllDescendantIds,
      flatOptions,
      expandedIds,
      onChangeWithAggregate,
    ],
  );

  const displayLabels = useMemo(() => {
    if (value.length === 0) {
      return [];
    }

    const result: string[] = [];
    const processedIds = new Set<number>();

    const rootOptions = getChildren(null);
    rootOptions.forEach((root) => {
      const descendants = getAllDescendantIds(root.id);
      if (descendants.length > 0 && descendants.every((id) => idSet.has(id))) {
        result.push(root.label);
        processedIds.add(root.id);
        descendants.forEach((id) => processedIds.add(id));
      }
    });

    value.forEach((id) => {
      if (!processedIds.has(id)) {
        const option = flatOptions.find((opt) => opt.id === id);
        if (option) {
          result.push(option.label);
        }
      }
    });

    return result;
  }, [value, idSet, getChildren, getAllDescendantIds, flatOptions]);

  return (
    <Stack gap={1}>
      {label && (
        <Box
          sx={{
            fontSize: 12,
            lineHeight: 1.5,
            color: 'text.primary',
          }}
        >
          {label}
        </Box>
      )}

      <Box
        onClick={onTriggerClick}
        ref={triggerRef}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: 32,
          px: 1,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: isOpen ? 'border.hover' : 'border.default',
          borderRadius: 2,
          cursor: 'text',
          '&:hover': {
            borderColor: 'border.hover',
          },
        }}
      >
        <InputBase
          id={inputId}
          inputProps={{
            'aria-autocomplete': 'none',
            autoComplete: 'new-password',
            'data-form-type': 'other',
            'data-lpignore': 'true',
          }}
          inputRef={inputRef}
          name={`notaform-${inputId}`}
          onChange={onSearchChange}
          placeholder={placeholder}
          sx={{
            flex: 1,
            fontSize: 12,
            lineHeight: 20 / 12,
            '& .MuiInputBase-input': {
              p: 0,
              height: 20,
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.5,
              },
            },
          }}
          value={searchText}
        />
        <Stack
          sx={{ ml: 1, alignItems: 'center', flexDirection: 'row', gap: 0.5 }}
        >
          <QueryIcon.ArrowDown isOpen={isOpen} />
        </Stack>
      </Box>

      {displayLabels.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
          }}
        >
          {displayLabels.map((label, index) => (
            <Box
              key={`${label}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                bgcolor: '#F0F0F4',
                borderRadius: 1,
                fontSize: 12,
                lineHeight: 1.5,
                color: 'text.primary',
              }}
            >
              <Box
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  onChipDelete(label);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                {CHIP_CLOSE_ICON}
              </Box>
              {label}
            </Box>
          ))}
        </Box>
      )}

      <Popper
        anchorEl={triggerRef.current}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ]}
        open={isOpen}
        placement={'bottom-start'}
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener
          onClickAway={(event) => {
            if (triggerRef.current?.contains(event.target as Node)) {
              return;
            }
            onPopoverClose();
          }}
        >
          <Box
            sx={{
              display: 'flex',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0px 0px 6px 0px rgba(54, 52, 64, 0.14)',
              border: '1px solid #E9E9EF',
              bgcolor: '#fff',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  height: 56,
                  justifyContent: 'center',
                  width: triggerRef.current?.offsetWidth,
                }}
              >
                <QueryIcon.Loading />
              </Box>
            ) : columns.length === 0 ? (
              <Box
                sx={{
                  alignItems: 'center',
                  color: 'action.disabled',
                  display: 'flex',
                  fontSize: 14,
                  height: 56,
                  justifyContent: 'center',
                  width: triggerRef.current?.offsetWidth,
                }}
              >
                No options
              </Box>
            ) : (
              columns.map((columnOptions, columnIndex) => {
                const isInSearchMode = !!searchResults;

                return (
                  <Box
                    key={columnIndex}
                    sx={{
                      maxHeight: 300,
                      overflow: 'auto',
                      borderRight: '1px solid',
                      borderColor: 'border.default',
                      '&:last-child': {
                        borderRight: 'none',
                      },
                      ...(isInSearchMode && {
                        width: triggerRef.current?.offsetWidth,
                      }),
                    }}
                  >
                    {columnOptions.map((option) => {
                      const children = getChildren(option.id);
                      const hasChildren = children.length > 0;
                      const isLeaf = !hasChildren;
                      const isChecked = idSet.has(option.id);
                      const isParentActive = activePath.includes(option.id);

                      const descendants = hasChildren
                        ? getAllDescendantIds(option.id)
                        : [];
                      const selectedChildCount = descendants.filter((id) =>
                        idSet.has(id),
                      ).length;
                      const isAllChildrenSelected =
                        descendants.length > 0 &&
                        selectedChildCount === descendants.length;

                      return (
                        <Box
                          key={option.id}
                          onClick={() => {
                            if (isInSearchMode || isLeaf) {
                              onToggleOption(option.id);
                            } else {
                              onParentOptionClick(option.id, columnIndex);
                            }
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            py: 1,
                            px: 2,
                            fontSize: 14,
                            color: 'text.primary',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'background.active',
                            },
                            ...(isParentActive && {
                              bgcolor: 'background.active',
                            }),
                            width:
                              isLeaf && !isInSearchMode
                                ? 300
                                : triggerRef?.current?.offsetWidth,
                          }}
                        >
                          <Checkbox
                            checked={isLeaf ? isChecked : isAllChildrenSelected}
                            checkedIcon={<QueryIcon.CheckboxChecked />}
                            icon={<QueryIcon.CheckboxUnchecked />}
                            indeterminate={
                              !isLeaf &&
                              selectedChildCount > 0 &&
                              !isAllChildrenSelected
                            }
                            indeterminateIcon={
                              <QueryIcon.CheckboxIndeterminate />
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isLeaf) {
                                onToggleOption(option.id);
                              } else if (isAllChildrenSelected) {
                                onChangeWithAggregate(
                                  expandedIds.filter(
                                    (id) => !descendants.includes(id),
                                  ),
                                );
                              } else {
                                const otherIds = expandedIds.filter(
                                  (id) => !descendants.includes(id),
                                );
                                onChangeWithAggregate([
                                  ...otherIds,
                                  ...descendants,
                                ]);
                              }
                            }}
                            size="small"
                            sx={{ p: 0 }}
                          />
                          <span
                            style={{
                              flex: 1,
                            }}
                          >
                            {isInSearchMode
                              ? getPathLabels(option.value).join(' / ')
                              : option.label}
                          </span>
                          {!isInSearchMode && hasChildren && (
                            <QueryIcon.Arrow
                              size={16}
                              sx={{ transform: 'rotate(-90deg)', ml: 'auto' }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })
            )}
          </Box>
        </ClickAwayListener>
      </Popper>
    </Stack>
  );
};

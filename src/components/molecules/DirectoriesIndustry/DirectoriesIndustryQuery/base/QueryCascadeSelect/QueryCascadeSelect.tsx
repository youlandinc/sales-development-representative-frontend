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

import { QueryAutoCompleteChip } from '../QueryAutoComplete';

import { CascadeOption, useCascadeOptions, useCascadeSelection } from './hooks';
import {
  ARROW_ICON,
  buildPopupIcon,
  CHECKBOX_CHECKED_ICON,
  CHECKBOX_INDETERMINATE_ICON,
  CHECKBOX_UNCHECKED_ICON,
  CLEAR_ICON,
  LOADING_SPINNER,
} from './QueryCascadeSelectIcons';

export interface QueryCascadeSelectProps {
  url: string | null;
  value?: string[];
  onFormChange: (newValue: string[]) => void;
  requestParams?: Record<string, string[]>;
  placeholder?: string;
}

export const QueryCascadeSelect: FC<QueryCascadeSelectProps> = ({
  url,
  value = [],
  onFormChange,
  requestParams,
  placeholder = 'Please select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activePath, setActivePath] = useState<number[]>([]);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const { flatOptions, isLoading, fetchOptions, getChildren, getPathLabels } =
    useCascadeOptions({
      url,
      requestParams,
    });

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, fetchOptions]);

  const {
    valueSet,
    expandedValues,
    getAllDescendantValues,
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

  const onClearClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onFormChange([]);
    },
    [onFormChange],
  );

  const onChipDelete = useCallback(
    (label: string) => {
      const rootOptions = getChildren(null);
      const matchedRoot = rootOptions.find((opt) => opt.label === label);
      if (matchedRoot) {
        // Remove all descendant values from expandedValues
        const descendants = getAllDescendantValues(matchedRoot.id);
        const toRemove = new Set(descendants);
        const newExpandedValues = expandedValues.filter(
          (v) => !toRemove.has(v),
        );
        onChangeWithAggregate(newExpandedValues);
      } else {
        const matchedOption = flatOptions.find((opt) => opt.label === label);
        if (matchedOption) {
          const newExpandedValues = expandedValues.filter(
            (v) => v !== matchedOption.value,
          );
          onChangeWithAggregate(newExpandedValues);
        }
      }
    },
    [
      getChildren,
      getAllDescendantValues,
      flatOptions,
      expandedValues,
      onChangeWithAggregate,
    ],
  );

  const displayLabels = useMemo(() => {
    if (value.length === 0) {
      return [];
    }

    const result: string[] = [];
    const processedValues = new Set<string>();

    const rootOptions = getChildren(null);
    rootOptions.forEach((root) => {
      const descendants = getAllDescendantValues(root.id);
      if (descendants.length > 0 && descendants.every((v) => valueSet.has(v))) {
        result.push(root.label);
        // Mark both parent value and descendants as processed
        processedValues.add(root.value);
        descendants.forEach((v) => processedValues.add(v));
      }
    });

    value.forEach((v) => {
      if (!processedValues.has(v)) {
        const option = flatOptions.find((opt) => opt.value === v);
        if (option) {
          result.push(option.label);
        }
      }
    });

    return result;
  }, [value, valueSet, getChildren, getAllDescendantValues, flatOptions]);

  return (
    <>
      <Box
        onClick={onTriggerClick}
        ref={triggerRef}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.5,
          minHeight: 32,
          py: 0.5,
          pl: value.length > 0 ? 0.75 : 1.25,
          pr: value.length > 0 ? 5 : 3.5,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: isOpen ? 'border.hover' : 'border.default',
          borderRadius: 2,
          cursor: 'text',
          '&:hover': {
            bgcolor: 'background.active',
            borderColor: 'border.default',
            '& .clear-icon': {
              display: 'flex',
            },
          },
        }}
      >
        {displayLabels.map((label, index) => (
          <QueryAutoCompleteChip
            key={`${label}-${index}`}
            label={label}
            onDelete={(e) => {
              e.stopPropagation();
              onChipDelete(label);
            }}
          />
        ))}
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
          placeholder={displayLabels.length === 0 ? placeholder : ''}
          sx={{
            flex: 1,
            minWidth: 30,
            fontSize: 12,
            lineHeight: 20 / 12,
            '& .MuiInputBase-input': {
              p: 0,
              height: 20,
              pl: 0.5,
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.5,
              },
            },
          }}
          value={searchText}
        />
        <Stack
          alignItems="center"
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            right: 9,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {value.length > 0 && (
            <Box
              className="clear-icon"
              onClick={onClearClick}
              sx={{ display: isOpen ? 'flex' : 'none' }}
            >
              {CLEAR_ICON}
            </Box>
          )}
          {buildPopupIcon(isOpen)}
        </Stack>
      </Box>

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
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.default',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: 'border.default',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 56,
                  width: triggerRef.current?.offsetWidth,
                }}
              >
                {LOADING_SPINNER}
              </Box>
            ) : columns.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: 'action.disabled',
                  height: 56,
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
                      const isChecked = valueSet.has(option.value);
                      const isParentActive = activePath.includes(option.id);

                      const descendants = hasChildren
                        ? getAllDescendantValues(option.id)
                        : [];
                      const selectedChildCount = descendants.filter((v) =>
                        valueSet.has(v),
                      ).length;
                      const isAllChildrenSelected =
                        descendants.length > 0 &&
                        selectedChildCount === descendants.length;

                      return (
                        <Box
                          key={option.value}
                          onClick={() => {
                            if (isInSearchMode || isLeaf) {
                              onToggleOption(option.value);
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
                            checkedIcon={CHECKBOX_CHECKED_ICON}
                            icon={CHECKBOX_UNCHECKED_ICON}
                            indeterminate={
                              !isLeaf &&
                              selectedChildCount > 0 &&
                              !isAllChildrenSelected
                            }
                            indeterminateIcon={CHECKBOX_INDETERMINATE_ICON}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isLeaf) {
                                onToggleOption(option.value);
                              } else if (isAllChildrenSelected) {
                                // Deselect all descendants
                                onChangeWithAggregate(
                                  expandedValues.filter(
                                    (v) => !descendants.includes(v),
                                  ),
                                );
                              } else {
                                // Select all descendants
                                const otherValues = expandedValues.filter(
                                  (v) => !descendants.includes(v),
                                );
                                onChangeWithAggregate([
                                  ...otherValues,
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
                          {!isInSearchMode && hasChildren && ARROW_ICON}
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
    </>
  );
};

import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, CircularProgress, Icon, Popover, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { CascadeOption, useCascadeOptions } from './useCascadeOptions';

import ICON_ARROW from '../assets/icon-arrow.svg';
import ICON_CLOSE from '../assets/icon-close.svg';

export interface QueryCascadeSelectProps {
  parentUrl?: string;
  childUrlTemplate?: string;
  value?: string[];
  onFormChange: (newValue: string[]) => void;
  requestParams?: Record<string, string[]>;
  placeholder?: string;
  mockParentOptions?: CascadeOption[];
  mockChildrenByParent?: Record<string, CascadeOption[]>;
}

const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

const POPUP_ICON = (
  <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
);

const LOADING_SPINNER = (
  <CircularProgress size="20px" sx={{ color: '#D0CEDA' }} />
);

const POPOVER_SX = {
  display: 'flex',
  bgcolor: 'white',
  borderRadius: 2,
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
} as const;

const COLUMN_SX = {
  minWidth: 200,
  maxWidth: 280,
  maxHeight: 300,
  overflow: 'auto',
  borderRight: '1px solid #F0F0F4',
  '&:last-child': {
    borderRight: 'none',
  },
} as const;

const OPTION_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 1.5,
  py: 1,
  fontSize: 14,
  color: '#363440',
  cursor: 'pointer',
  '&:hover': {
    bgcolor: '#F4F5F9',
  },
} as const;

const OPTION_ACTIVE_SX = {
  ...OPTION_SX,
  bgcolor: '#F4F5F9',
} as const;

const TICK_ICON_SX = {
  width: 16,
  height: 16,
  flexShrink: 0,
} as const;

const LOADING_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  py: 3,
  minWidth: 200,
} as const;

export const QueryCascadeSelect: FC<QueryCascadeSelectProps> = ({
  parentUrl,
  childUrlTemplate,
  value = [],
  onFormChange,
  requestParams,
  placeholder = 'Please select',
  mockParentOptions,
  mockChildrenByParent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeParent, setActiveParent] = useState<CascadeOption | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    parentOptions,
    childOptions,
    isLoadingParent,
    isLoadingChildren,
    childrenByParent,
    fetchParentOptions,
    fetchChildOptions,
  } = useCascadeOptions({
    requestParams,
    mockParentOptions,
    mockChildrenByParent,
  });

  useEffect(() => {
    if (isOpen) {
      fetchParentOptions(parentUrl);
    }
  }, [isOpen, parentUrl, fetchParentOptions]);

  const getChildrenForParent = useCallback(
    (parentKey: string): CascadeOption[] => {
      if (mockChildrenByParent) {
        return mockChildrenByParent[parentKey] || [];
      }
      return childrenByParent.get(parentKey) || [];
    },
    [mockChildrenByParent, childrenByParent],
  );

  const filteredParentOptions = useMemo(() => {
    if (!searchText.trim()) {
      return parentOptions;
    }
    const lowerSearch = searchText.toLowerCase();
    return parentOptions.filter(
      (opt: CascadeOption) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        getChildrenForParent(opt.key).some((child: CascadeOption) =>
          child.label.toLowerCase().includes(lowerSearch),
        ),
    );
  }, [parentOptions, searchText, getChildrenForParent]);

  const filteredChildOptions = useMemo(() => {
    if (!activeParent) {
      return [];
    }
    const children = getChildrenForParent(activeParent.key);
    if (!searchText.trim()) {
      return children;
    }
    const lowerSearch = searchText.toLowerCase();
    return children.filter((opt: CascadeOption) =>
      opt.label.toLowerCase().includes(lowerSearch),
    );
  }, [activeParent, searchText, getChildrenForParent]);

  const selectedLabels = useMemo(() => {
    const labels: string[] = [];
    value.forEach((v) => {
      const [parentKey, childKey] = v.split('::');
      const parent = parentOptions.find((p) => p.key === parentKey);
      const children = childrenByParent.get(parentKey);
      const child = children?.find((c) => c.key === childKey);
      if (parent && child) {
        labels.push(`${parent.label} / ${child.label}`);
      } else if (child) {
        labels.push(child.label);
      }
    });
    return labels;
  }, [value, parentOptions, childrenByParent]);

  const getSelectedChildrenForParent = useCallback(
    (parentKey: string) => value.filter((v) => v.startsWith(`${parentKey}::`)),
    [value],
  );

  const isParentFullySelected = useCallback(
    (parentKey: string) => {
      const children = childrenByParent.get(parentKey);
      if (!children || children.length === 0) {
        return false;
      }
      return children.every((child: CascadeOption) =>
        value.includes(`${parentKey}::${child.key}`),
      );
    },
    [childrenByParent, value],
  );

  const isParentPartiallySelected = useCallback(
    (parentKey: string) => {
      const selected = getSelectedChildrenForParent(parentKey);
      const children = childrenByParent.get(parentKey);
      return (
        selected.length > 0 && children && selected.length < children.length
      );
    },
    [getSelectedChildrenForParent, childrenByParent],
  );

  const onTriggerClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onPopoverClose = useCallback(() => {
    setIsOpen(false);
    setActiveParent(null);
    setSearchText('');
  }, []);

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const onParentItemClick = useCallback(
    (option: CascadeOption) => {
      if (activeParent?.key === option.key) {
        return;
      }
      setActiveParent(option);

      if (mockChildrenByParent) {
        fetchChildOptions(option.key);
      } else if (childUrlTemplate) {
        const childUrl = childUrlTemplate.replace('{parentKey}', option.key);
        fetchChildOptions(childUrl, option.key);
      }
    },
    [
      activeParent?.key,
      childUrlTemplate,
      fetchChildOptions,
      mockChildrenByParent,
    ],
  );

  const onParentCheckClick = useCallback(
    (e: MouseEvent, option: CascadeOption) => {
      e.stopPropagation();
      const children = getChildrenForParent(option.key);
      if (children.length === 0) {
        return;
      }

      const isFullySelected = children.every((child: CascadeOption) =>
        value.includes(`${option.key}::${child.key}`),
      );
      if (isFullySelected) {
        onFormChange(value.filter((v) => !v.startsWith(`${option.key}::`)));
      } else {
        const otherSelections = value.filter(
          (v) => !v.startsWith(`${option.key}::`),
        );
        const allChildSelections = children.map(
          (child: CascadeOption) => `${option.key}::${child.key}`,
        );
        onFormChange([...otherSelections, ...allChildSelections]);
      }
    },
    [getChildrenForParent, value, onFormChange],
  );

  const onChildSelect = useCallback(
    (childKey: string) => {
      if (!activeParent) {
        return;
      }
      const compositeKey = `${activeParent.key}::${childKey}`;
      const isSelected = value.includes(compositeKey);
      if (isSelected) {
        onFormChange(value.filter((v) => v !== compositeKey));
      } else {
        onFormChange([...value, compositeKey]);
      }
    },
    [activeParent, value, onFormChange],
  );

  const isChildSelected = useCallback(
    (childKey: string) => {
      if (!activeParent) {
        return false;
      }
      return value.includes(`${activeParent.key}::${childKey}`);
    },
    [activeParent, value],
  );

  const onClearClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onFormChange([]);
    },
    [onFormChange],
  );

  return (
    <>
      <Box
        ref={triggerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 36,
          px: 1.5,
          bgcolor: 'white',
          border: '1px solid',
          borderColor: isOpen ? '#5B76BC' : '#DFDEE6',
          borderRadius: 1,
          '&:hover': {
            borderColor: '#5B76BC',
          },
        }}
      >
        <Box
          component="input"
          onChange={onSearchChange}
          onClick={onTriggerClick}
          placeholder={
            value.length > 0 ? `${value.length} selected` : placeholder
          }
          sx={{
            flex: 1,
            border: 'none',
            outline: 'none',
            bgcolor: 'transparent',
            fontSize: 14,
            color: '#363440',
            '&::placeholder': {
              color: value.length > 0 ? '#363440' : '#B0ADBD',
            },
          }}
          value={searchText}
        />
        <Stack alignItems="center" direction="row" spacing={0.5}>
          {value.length > 0 && <Box onClick={onClearClick}>{CLEAR_ICON}</Box>}
          {POPUP_ICON}
        </Stack>
      </Box>

      <Popover
        anchorEl={triggerRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={(event, reason) => {
          if (reason === 'backdropClick' && event) {
            const mouseEvent = event as globalThis.MouseEvent;
            const target = mouseEvent.target as Node;
            if (triggerRef.current?.contains(target)) {
              return;
            }
          }
          onPopoverClose();
        }}
        open={isOpen}
        slotProps={{
          paper: { sx: { ...POPOVER_SX, mt: 0.5 } },
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={COLUMN_SX}>
          {isLoadingParent ? (
            <Box sx={LOADING_SX}>{LOADING_SPINNER}</Box>
          ) : (
            filteredParentOptions.map((option: CascadeOption) => {
              const isActive = activeParent?.key === option.key;
              const children = getChildrenForParent(option.key);
              const hasChildren = children.length > 0;
              const isFullySelected =
                hasChildren &&
                children.every((child: CascadeOption) =>
                  value.includes(`${option.key}::${child.key}`),
                );
              const isPartiallySelected =
                hasChildren &&
                !isFullySelected &&
                children.some((child: CascadeOption) =>
                  value.includes(`${option.key}::${child.key}`),
                );

              return (
                <Box
                  key={option.key}
                  onClick={() => onParentItemClick(option)}
                  sx={isActive ? OPTION_ACTIVE_SX : OPTION_SX}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    flex={1}
                    spacing={0.5}
                  >
                    {hasChildren && (
                      <Box
                        onClick={(e) => onParentCheckClick(e, option)}
                        sx={{
                          width: 16,
                          height: 16,
                          border: '1px solid',
                          borderColor:
                            isFullySelected || isPartiallySelected
                              ? '#5B76BC'
                              : '#DFDEE6',
                          borderRadius: 0.5,
                          bgcolor: isFullySelected ? '#5B76BC' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isFullySelected && (
                          <CheckIcon
                            sx={{ width: 12, height: 12, color: 'white' }}
                          />
                        )}
                        {isPartiallySelected && (
                          <Box
                            sx={{
                              width: 8,
                              height: 2,
                              bgcolor: '#5B76BC',
                              borderRadius: 0.25,
                            }}
                          />
                        )}
                      </Box>
                    )}
                    <span>{option.label}</span>
                  </Stack>
                  <Box
                    component="img"
                    src={ICON_ARROW}
                    sx={{ width: 16, height: 16, transform: 'rotate(-90deg)' }}
                  />
                </Box>
              );
            })
          )}
        </Box>

        {activeParent && (
          <Box sx={COLUMN_SX}>
            {isLoadingChildren ? (
              <Box sx={LOADING_SX}>{LOADING_SPINNER}</Box>
            ) : (
              filteredChildOptions.map((child: CascadeOption) => {
                const isSelected = isChildSelected(child.key);
                return (
                  <Box
                    key={child.key}
                    onClick={() => onChildSelect(child.key)}
                    sx={OPTION_SX}
                  >
                    <span>{child.label}</span>
                    {isSelected && (
                      <CheckIcon sx={{ ...TICK_ICON_SX, color: '#5B76BC' }} />
                    )}
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Popover>
    </>
  );
};

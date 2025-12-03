import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  Fade,
  Icon,
  Popper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

import {
  StyledButton,
  StyledDatePicker,
  StyledSelect,
} from '@/components/atoms';

import ICON_CLOSE from './assets/icon-close.svg';
import ICON_ARROW_DOWN from './assets/icon-arrow-down.svg';

import {
  QUERY_TOOLTIP_SLOT_PROPS,
  QueryTooltipAccessTitle,
} from './QueryTooltip';

const DATE_PICKER_SLOT_PROPS = {
  textField: {
    placeholder: 'Select date',
  },
} as const;

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateField: FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}) => (
  <Stack sx={{ gap: 0.5 }}>
    <Typography sx={{ fontSize: 12 }}>{label}</Typography>
    <StyledDatePicker
      maxDate={maxDate}
      minDate={minDate}
      onChange={onChange}
      size={'small'}
      slotProps={DATE_PICKER_SLOT_PROPS}
      value={value}
    />
  </Stack>
);

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface QueryDateSelectRangeProps {
  options?: TOption[];
  value?: string | null;
  dateRange?: DateRange | null;
  placeholder?: string;
  isAuth?: boolean;
  onFormChange?: (value: string | null, dateRange?: DateRange | null) => void;
}

export const QueryDateSelectRange: FC<QueryDateSelectRangeProps> = ({
  options = [
    { label: 'This year', value: 'this_year', key: 'this_year' },
    { label: 'Custom', value: 'CUSTOM_RANGE', key: 'CUSTOM_RANGE' },
  ],
  value: externalValue,
  dateRange: externalDateRange,
  placeholder,
  isAuth = true,
  onFormChange,
}) => {
  const [selectValue, setSelectValue] = useState(externalValue || '');
  const [startDate, setStartDate] = useState<Date | null>(
    externalDateRange?.startDate || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    externalDateRange?.endDate || null,
  );
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);

  const displayOptions = useMemo(() => {
    if (isAuth) {
      return options;
    }
    return options.map((opt) => ({ ...opt, disabled: true }));
  }, [options, isAuth]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setSelectValue(externalValue || '');
    }
  }, [externalValue]);

  useEffect(() => {
    if (externalDateRange !== undefined) {
      setStartDate(externalDateRange?.startDate || null);
      setEndDate(externalDateRange?.endDate || null);
    }
  }, [externalDateRange]);

  const onSelectChange = useCallback(
    (newValue: string) => {
      setSelectValue(newValue);
      if (newValue === 'CUSTOM_RANGE') {
        setIsPopperOpen(true);
      } else {
        setIsPopperOpen(false);
        onFormChange?.(newValue, null);
      }
    },
    [onFormChange],
  );

  const onCloseToOpenPopper = useCallback(() => {
    if (selectValue === 'CUSTOM_RANGE' && !isPopperOpen) {
      setIsPopperOpen(true);
    }
  }, [selectValue, isPopperOpen]);

  const onClickToCancel = useCallback(() => {
    setStartDate(externalDateRange?.startDate || null);
    setEndDate(externalDateRange?.endDate || null);
    setIsPopperOpen(false);
    // Restore selectValue to externalValue (previous committed value)
    setSelectValue(externalValue || '');
  }, [externalDateRange, externalValue]);

  const onClickToSave = useCallback(() => {
    setIsPopperOpen(false);
    if (!startDate && !endDate) {
      setSelectValue('');
      onFormChange?.(null, null);
      return;
    }
    onFormChange?.('CUSTOM_RANGE', { startDate, endDate });
  }, [startDate, endDate, onFormChange]);

  const onClickAwayToCancel = useCallback(() => {
    if (isPopperOpen) {
      onClickToCancel();
    }
  }, [isPopperOpen, onClickToCancel]);

  const onClear = useCallback(() => {
    setSelectValue('');
    setStartDate(null);
    setEndDate(null);
    setIsPopperOpen(false);
    onFormChange?.(null, null);
  }, [onFormChange]);

  const formatDateRange = useCallback(
    (start: Date | null, end: Date | null) => {
      if (!start && !end) {
        return null;
      }
      const startStr = start ? format(start, 'MM/dd/yyyy') : '';
      const endStr = end ? format(end, 'MM/dd/yyyy') : '';
      if (startStr && endStr) {
        return `${startStr} - ${endStr}`;
      }
      if (startStr) {
        return `From ${startStr}`;
      }
      if (endStr) {
        return `Until ${endStr}`;
      }
      return null;
    },
    [],
  );

  const buildRenderValue = useCallback(
    (selected: unknown) => {
      if (!selected || selected === '') {
        return (
          <Typography
            sx={{ color: 'text.secondary', fontSize: 12, opacity: 0.5 }}
          >
            {placeholder}
          </Typography>
        );
      }
      if (selected === 'CUSTOM_RANGE') {
        const dateRangeStr = formatDateRange(startDate, endDate);
        if (dateRangeStr) {
          return <Typography sx={{ fontSize: 12 }}>{dateRangeStr}</Typography>;
        }
        return <Typography sx={{ fontSize: 12 }}>Custom</Typography>;
      }
      const option = options.find((opt) => opt.value === selected);
      const label = option?.label || String(selected);
      return <Typography sx={{ fontSize: 12 }}>{label}</Typography>;
    },
    [placeholder, startDate, endDate, formatDateRange, options],
  );

  return (
    <ClickAwayListener onClickAway={onClickAwayToCancel}>
      <Stack ref={anchorRef}>
        <Tooltip
          arrow
          disableHoverListener
          open={!isAuth && isMenuOpen}
          placement={'top'}
          slotProps={QUERY_TOOLTIP_SLOT_PROPS}
          title={<QueryTooltipAccessTitle />}
        >
          <Box>
            <StyledSelect
              clearable={!!selectValue}
              clearIcon={
                <Icon
                  component={ICON_CLOSE}
                  sx={{ width: 14, height: 14, cursor: 'pointer' }}
                />
              }
              IconComponent={({ className }) => {
                return (
                  <Stack
                    className={className}
                    sx={{
                      mr: 0.25,
                    }}
                  >
                    <Icon
                      component={ICON_ARROW_DOWN}
                      sx={{
                        width: 14,
                        height: 14,
                      }}
                    />
                  </Stack>
                );
              }}
              menuPaperSx={{
                mt: 0.5,
                borderRadius: 2,
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E0E0E0',
              }}
              onChange={(e) => onSelectChange(e.target.value as string)}
              onClear={onClear}
              onClose={() => {
                setIsMenuOpen(false);
                onCloseToOpenPopper();
              }}
              onOpen={() => setIsMenuOpen(true)}
              options={displayOptions}
              placeholder={placeholder}
              renderValue={buildRenderValue}
              size={'small'}
              sxList={{
                py: 0,
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  fontSize: 14,
                  minHeight: 'auto',
                  '&.Mui-selected': {
                    bgcolor: 'transparent',
                  },
                },
              }}
              value={selectValue}
            />
          </Box>
        </Tooltip>
        <Popper
          anchorEl={anchorRef.current}
          open={isPopperOpen}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={300}>
              <Stack
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  gap: 1.5,
                  p: 3,
                  mt: 1.5,
                  boxShadow:
                    '0 0 2px 0 rgba(17, 52, 227, 0.10), 0 10px 10px 0 rgba(17, 52, 227, 0.10)',
                  width: anchorRef.current?.offsetWidth,
                }}
              >
                <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    Select a custom range
                  </Typography>
                  <Icon
                    component={ICON_CLOSE}
                    onClick={onClickToCancel}
                    sx={{
                      width: 16,
                      height: 16,
                      ml: 'auto',
                      cursor: 'pointer',
                    }}
                  />
                </Stack>
                <DateField
                  label="Start date"
                  maxDate={endDate || undefined}
                  onChange={setStartDate}
                  value={startDate}
                />
                <DateField
                  label="End date"
                  minDate={startDate || undefined}
                  onChange={setEndDate}
                  value={endDate}
                />
                <Stack
                  sx={{
                    flexDirection: 'row',
                    gap: 1.5,
                    justifyContent: 'flex-end',
                  }}
                >
                  <StyledButton
                    onClick={onClickToCancel}
                    size={'small'}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton onClick={onClickToSave} size={'small'}>
                    Save
                  </StyledButton>
                </Stack>
              </Stack>
            </Fade>
          )}
        </Popper>
      </Stack>
    </ClickAwayListener>
  );
};

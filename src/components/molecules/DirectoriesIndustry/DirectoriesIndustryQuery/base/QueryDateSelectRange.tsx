import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  Fade,
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

import {
  QUERY_TOOLTIP_SLOT_PROPS,
  QueryIcon,
  QueryTooltipAccessTitle,
} from './index';

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

export interface QueryDateSelectRangeFormValue {
  selectType?: string;
  startDate?: string;
  endDate?: string;
}

interface QueryDateSelectRangeProps {
  options?: TOption[];
  formValue?: QueryDateSelectRangeFormValue;
  placeholder?: string;
  isAuth?: boolean;
  onFormChange?: (value: QueryDateSelectRangeFormValue) => void;
}

// Helper: parse ISO string to Date
const parseISOToDate = (isoString?: string): Date | null => {
  if (!isoString) {
    return null;
  }
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper: format Date to ISO string
const formatDateToISO = (date: Date | null): string => {
  return date ? date.toISOString() : '';
};

export const QueryDateSelectRange: FC<QueryDateSelectRangeProps> = ({
  options = [
    { label: 'This year', value: 'this_year', key: 'this_year' },
    { label: 'Custom', value: 'CUSTOM_RANGE', key: 'CUSTOM_RANGE' },
  ],
  formValue,
  placeholder,
  isAuth = true,
  onFormChange,
}) => {
  // Parse external formValue to internal state
  const externalSelectType = formValue?.selectType || '';
  const externalStartDate = parseISOToDate(formValue?.startDate);
  const externalEndDate = parseISOToDate(formValue?.endDate);

  const [selectValue, setSelectValue] = useState(externalSelectType);
  const [startDate, setStartDate] = useState<Date | null>(externalStartDate);
  const [endDate, setEndDate] = useState<Date | null>(externalEndDate);
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
    setSelectValue(externalSelectType);
  }, [externalSelectType]);

  useEffect(() => {
    setStartDate(externalStartDate);
    setEndDate(externalEndDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue?.startDate, formValue?.endDate]);

  const onSelectChange = useCallback(
    (newValue: string) => {
      setSelectValue(newValue);
      if (newValue === 'CUSTOM_RANGE') {
        setIsPopperOpen(true);
      } else {
        setIsPopperOpen(false);
        onFormChange?.({ selectType: newValue, startDate: '', endDate: '' });
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
    setStartDate(externalStartDate);
    setEndDate(externalEndDate);
    setIsPopperOpen(false);
    // Restore selectValue to externalSelectType (previous committed value)
    setSelectValue(externalSelectType);
  }, [externalStartDate, externalEndDate, externalSelectType]);

  const onClickToSave = useCallback(() => {
    setIsPopperOpen(false);
    if (!startDate && !endDate) {
      setSelectValue('');
      onFormChange?.({ selectType: '', startDate: '', endDate: '' });
      return;
    }
    onFormChange?.({
      selectType: 'CUSTOM_RANGE',
      startDate: formatDateToISO(startDate),
      endDate: formatDateToISO(endDate),
    });
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
    onFormChange?.({ selectType: '', startDate: '', endDate: '' });
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
              clearIcon={<QueryIcon.Close />}
              IconComponent={({ className }) => (
                <Stack className={className} sx={{ mr: 0.25 }}>
                  <QueryIcon.ArrowDown />
                </Stack>
              )}
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
                  <QueryIcon.Close
                    onClick={onClickToCancel}
                    size={16}
                    sx={{ ml: 'auto', cursor: 'pointer' }}
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

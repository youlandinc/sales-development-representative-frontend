import { FC } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';

type StyledDatePickerProps = DatePickerProps<Date> & { onClear?: () => void };

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  onClear,
  slotProps,
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slotProps={{
          textField: {
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: 1.5,
                fontSize: 16,
                lineHeight: 1.5,
                height: 'auto',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(16px, 12px) scale(1)',
              },
              '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                transform: 'translate(14px, -7px) scale(0.75)',
              },
              '& .Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
              },
              '& .Mui-focused.MuiInputLabel-root': {
                transform: 'translate(16px, -7px) scale(0.75)',
              },

              '& .Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'border.focus',
                  borderWidth: '1px',
                },
              },
            },
          },
          field: { clearable: true, onClear: () => onClear },
          openPickerIcon: {
            style: {
              width: 20,
              height: 20,
            },
          },
          ...slotProps,
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};

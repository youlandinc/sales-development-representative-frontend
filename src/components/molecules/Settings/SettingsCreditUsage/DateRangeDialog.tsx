import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
} from '@/components/atoms';

interface DateRangeDialogProps {
  open: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onConfirm?: () => void;
}

export const DateRangeDialog: FC<DateRangeDialogProps> = ({
  open,
  onClose,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <StyledDialog
      content={
        <Stack gap={3} pt={3}>
          {/* Start date */}
          <Stack gap={0.5}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: '#363440',
                lineHeight: 1.4,
              }}
            >
              Start date
            </Typography>
            <StyledDatePicker
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  placeholder: 'Select date',
                },
              }}
              value={startDate}
              views={['year', 'month', 'day']}
            />
          </Stack>

          {/* End date */}
          <Stack gap={0.5}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: '#363440',
                lineHeight: 1.4,
              }}
            >
              End date
            </Typography>
            <StyledDatePicker
              minDate={startDate || undefined}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  placeholder: 'Select date',
                },
              }}
              value={endDate}
              views={['year', 'month', 'day']}
            />
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" gap={1.5} justifyContent="flex-end">
            <StyledButton
              color={'info'}
              onClick={handleCancel}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={!startDate}
              onClick={handleConfirm}
              size={'medium'}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
      }
      header={'Choose a date range'}
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          width: 368,
          p: 1.5,
        },
      }}
    />
  );
};

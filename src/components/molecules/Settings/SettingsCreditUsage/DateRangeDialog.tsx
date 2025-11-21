import { Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
} from '@/components/atoms';

interface DateRangeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (startDate: Date | null, endDate: Date | null) => void;
}

export const DateRangeDialog: FC<DateRangeDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleConfirm = () => {
    onConfirm?.(startDate, endDate);
    onClose();
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
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
              onChange={(newValue) => setStartDate(newValue)}
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
              onChange={(newValue) => setEndDate(newValue)}
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
              disabled={!startDate && !endDate}
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

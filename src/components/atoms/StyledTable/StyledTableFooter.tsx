import { FC, MouseEvent, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

import { StyledButton, StyledTextFieldNumber } from '@/components/atoms';

interface StyledTableAddRowsFooterProps {
  defaultRowCount?: number;
  onAddRows: (count: number) => Promise<void>;
  disabled?: boolean;
}

export const StyledTableFooter: FC<StyledTableAddRowsFooterProps> = ({
  defaultRowCount = 10,
  onAddRows,
  disabled = false,
}) => {
  const [addRowCount, setAddRowCount] = useState<number>(defaultRowCount);
  const [isAddingRows, setIsAddingRows] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isOpen = Boolean(anchorEl);

  const onClickToOpenPopper = (event: MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const onClickAwayToClosePopper = () => {
    setAnchorEl(null);
  };

  const onClickToAddRows = async () => {
    if (isAddingRows || disabled || addRowCount < 1) {
      return;
    }

    setIsAddingRows(true);
    try {
      await onAddRows(addRowCount);
      onClickAwayToClosePopper(); // Close popper after adding rows
    } catch (error) {
      console.error('Failed to add rows:', error);
    } finally {
      setIsAddingRows(false);
    }
  };

  return (
    <Stack
      px={2}
      py={1.5}
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      {/* Trigger button */}
      <Box
        onClick={onClickToOpenPopper}
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Typography fontSize={14} fontWeight={500}>
          + Add rows
        </Typography>
      </Box>

      <Popper
        anchorEl={anchorEl}
        open={isOpen}
        placement="bottom-start"
        sx={{
          zIndex: 100,
        }}
      >
        <ClickAwayListener onClickAway={onClickAwayToClosePopper}>
          <Paper
            elevation={0}
            sx={{
              mt: 1,
              p: 2,
              width: 350,
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack gap={2}>
              {/* Input row */}
              <Stack alignItems="center" direction="row" gap={1.5}>
                <Typography fontSize={14}>Add</Typography>
                <StyledTextFieldNumber
                  decimalScale={0}
                  disabled={isAddingRows || disabled}
                  onValueChange={(values) => {
                    const count = values.floatValue || defaultRowCount;
                    setAddRowCount(count);
                  }}
                  sx={{
                    width: 60,
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      borderRadius: 2,
                    },
                  }}
                  thousandSeparator={false}
                  value={addRowCount}
                />
                <Typography color="text.secondary" fontSize={16}>
                  more rows at the bottom
                </Typography>
              </Stack>

              {/* Save button */}
              <Stack alignItems="flex-end">
                <StyledButton
                  disabled={isAddingRows || disabled}
                  loading={isAddingRows}
                  onClick={onClickToAddRows}
                  size={'small'}
                  sx={{
                    width: 56,
                  }}
                  variant={'contained'}
                >
                  Save
                </StyledButton>
              </Stack>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Stack>
  );
};

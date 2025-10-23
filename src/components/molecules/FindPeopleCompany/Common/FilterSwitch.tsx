import { FC } from 'react';
import {
  FormControlLabel,
  FormControlLabelProps,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

export const FilterSwitch: FC<
  Omit<FormControlLabelProps, 'control'> & { description?: string }
> = ({ label, description, checked, onChange, ...props }) => {
  return (
    <Stack gap={1}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={label}
        labelPlacement={'start'}
        slotProps={{
          typography: {
            sx: {
              fontSize: 12,
            },
          },
        }}
        sx={{
          m: 0,
          p: 0,
          justifyContent: 'space-between',
          '& .MuiSwitch-thumb': {
            width: 14,
            height: 14,
            bgcolor: '#fff',
            transform: 'translateY(2px)',
          },
          '& .MuiButtonBase-root': {
            transform: 'translateX(3px)',
            p: 0,
          },
          '& .Mui-checked': {
            transform: 'translateX(15px) !important',
            '& .MuiSwitch-track': { opacity: '1 !important' },
          },
          '& .Mui-checked+.MuiSwitch-track': {
            opacity: '1 !important',
          },

          '& .MuiSwitch-track': { borderRadius: '50px', opacity: 0.38 },
          '& .MuiSwitch-root': {
            padding: 0,
            height: 18,
            width: 32,
          },
        }}
        {...props}
      />
      {description && (
        <Typography color={'text.secondary'} variant={'body3'}>
          {description}
        </Typography>
      )}
    </Stack>
  );
};

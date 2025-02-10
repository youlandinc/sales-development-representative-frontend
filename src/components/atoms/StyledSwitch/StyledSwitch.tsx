import { Switch, SwitchProps } from '@mui/material';

export const StyledSwitch = (props: SwitchProps) => {
  return (
    <Switch
      color={'primary'}
      disableRipple
      focusVisibleClassName=".Mui-focusVisible"
      inputProps={{ 'aria-label': 'controlled' }}
      sx={{
        width: 36,
        height: 20,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: '2px',
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#6E4EFB',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#6E4EFB',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: 'white',
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 16,
          height: 16,
        },
        '& .MuiSwitch-track': {
          borderRadius: 12,
          backgroundColor: 'rgba(145, 158, 171, 0.48)',
          opacity: 1,
          transition: {
            duration: 500,
          },
        },
      }}
      {...props}
    />
  );
};

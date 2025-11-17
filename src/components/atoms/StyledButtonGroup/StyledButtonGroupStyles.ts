export const StyledButtonGroupStyles = {
  '& .MuiToggleButton-root': {
    width: '100%',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 16,
    color: 'text.primary',
    borderWidth: '2px',
    boxShadow: 'none',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 0,
    '&.MuiToggleButtonGroup-middleButton, &.MuiToggleButtonGroup-lastButton': {
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
    '&.MuiToggleButtonGroup-middleButton, &.MuiToggleButtonGroup-firstButton': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      ml: '-2px',
      borderLeft: '2px solid transparent',
    },
    '&.MuiToggleButtonGroup-grouped.Mui-selected': {
      bgcolor: 'primary.main',
      borderColor: 'primary.main',
      color: 'text.white',
    },
    '&:disabled': {
      color: 'text.disabled',
      borderColor: 'text.secondary',
      '&.Mui-selected': {
        color: 'text.secondary',
        bgcolor: 'text.disabled',
        borderColor: 'text.secondary',
      },
    },
    '&.MuiToggleButton-sizeSmall': {
      height: 40,
      fontSize: 14,
    },
  },
} as const;

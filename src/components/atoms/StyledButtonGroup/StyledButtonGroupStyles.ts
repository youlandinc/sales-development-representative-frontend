export const StyledButtonGroupStyles = {
  '& .MuiToggleButton-root': {
    width: '100%',
    textTransform: 'none',
    fontWeight: 400,
    fontSize: 12,
    color: 'text.primary',
    borderWidth: '1px',
    boxShadow: 'none',
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 0,
    '&.MuiToggleButtonGroup-middleButton, &.MuiToggleButtonGroup-lastButton': {
      borderTopLeftRadius: '0px !important',
      borderBottomLeftRadius: '0px !important',
    },
    '&.MuiToggleButtonGroup-middleButton, &.MuiToggleButtonGroup-firstButton': {
      borderTopRightRadius: '0px !important',
      borderBottomRightRadius: '0px !important',
    },
    '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      ml: '-1px',
      borderLeft: '1px solid transparent',
    },
    '&.MuiToggleButtonGroup-grouped.Mui-selected': {
      bgcolor: '#F0F0F4',
      borderColor: 'primary.main',
      color: 'primary.main',
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

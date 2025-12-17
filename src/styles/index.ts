export const DEFAULT_AUTOCOMPLETE_SX = {
  '& .MuiInputBase-root': {
    py: 0,
  },
  '& .MuiAutocomplete-endAdornment': {
    top: '47%',
    // transform: 'none',
  },
  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  //small
  '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input': {
    paddingTop: '6px',
    paddingBottom: '6px',
  },
  '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-endAdornment':
    {
      top: 2,
    },
  '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-tag': {
    maxHeight: 18,
    fontSize: 12,
  },
  //large
  '& .MuiInputBase-sizeLarge .MuiAutocomplete-input': {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  '& .MuiInputBase-sizeLarge .MuiAutocomplete-endAdornment': {
    top: 9,
  },
  '& .MuiInputBase-sizeLarge .MuiAutocomplete-tag': {
    maxHeight: 28,
    fontSize: 12,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#4C4957 !important',
  },
  '& .MuiAutocomplete-tag': {
    maxHeight: 24,
    fontSize: 12,
  },
  '& .MuiAutocomplete-tagSizeMedium': {
    maxHeight: 24,
    fontSize: 12,
  },
  '& .MuiAutocomplete-tagSizeSmall': {
    maxHeight: 18,
    fontSize: 12,
  },
  '&.MuiAutocomplete-option[aria-selected="true"]:not(.Mui-focused)': {
    bgcolor: 'transparent !important',
  },
  '&.Mui-focused': {
    bgcolor: '#F4F5F9 !important',
  },
  '& .MuiSvgIcon-fontSizeSmall': {
    width: 14,
    height: 14,
  },
};

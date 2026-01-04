import { FC } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Checkbox,
  Chip,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { TreeNodeRenderTypeEnum } from '@/components/molecules';
import { SelectWithFlagTypeEnum } from '@/types';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const StyledSearchSelectChip = styled(Chip)({
  '&.MuiChip-root': {
    borderRadius: '16px',
  },
  '.MuiChip-deleteIcon': {
    color: 'text.primary',
    width: 16,
    height: 16,
  },
});

export interface StyledSearchSelectProps {
  options: TOption[];
  value: any[];
  onInputKeyDown?: (data: any[]) => void;
  onSelect?: (data: any[]) => void;
  onDelete?: (value: string) => void;
  onReset?: () => void;
  type?: TreeNodeRenderTypeEnum;
  id: string;
  disabled?: boolean;
  placeholder?: string;
  showCheckbox?: boolean;
  onChange?: AutocompleteProps<any, true, false, false>['onChange'];
}

export const StyledSearchSelect: FC<StyledSearchSelectProps> = ({
  options,
  value,
  onInputKeyDown,
  onSelect,
  onDelete,
  onReset,
  disabled,
  //type,
  id,
  placeholder,
  showCheckbox = true,
  onChange,
}) => {
  return (
    <Autocomplete
      disableCloseOnSelect
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      id={id}
      multiple
      onChange={onChange}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (
                !(e.target as HTMLInputElement).value ||
                options.some(
                  (item) => item.label === (e.target as HTMLInputElement).value,
                )
              ) {
                return;
              }
              onInputKeyDown?.([
                ...value,
                {
                  value: (e.target as HTMLInputElement).value,
                  label: (e.target as HTMLInputElement).value,
                  key: Math.random().toString(36) + '',
                  type: SelectWithFlagTypeEnum.input,
                },
              ]);
            }
          }}
          placeholder={placeholder}
        />
      )}
      renderOption={(props, option) => {
        return (
          <Box
            {...props}
            component={'li'}
            key={`${option.key}-checkbox-key`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (value.some((item) => item.value === option.value)) {
                onDelete?.(option.value);
              } else {
                onSelect?.([
                  ...value,
                  {
                    value: option.value,
                    key: option.key,
                    label: option.label,
                    type: SelectWithFlagTypeEnum.select,
                  },
                ]);
              }
            }}
            sx={{
              bgcolor: value.some((item) => item.value === option.value)
                ? '#EFE9FB'
                : 'transparent',
            }}
          >
            {showCheckbox && (
              <Checkbox
                checked={value.some((item) => item.value === option.value)}
                checkedIcon={checkedIcon}
                icon={icon}
                style={{ marginRight: 8 }}
              />
            )}
            {option.label}
          </Box>
        );
      }}
      renderValue={(value, getTagProps) => {
        return value.map((option, index) => (
          <StyledSearchSelectChip
            {...getTagProps({ index })}
            deleteIcon={<ClearIcon />}
            key={`${option.key}-chip-${index}-key`}
            label={`${option.label}`}
            onDelete={() => {
              onDelete?.(option.value);
            }}
            variant="filled"
          />
        ));
      }}
      slotProps={{
        clearIndicator: {
          onClick: () => onReset?.(),
        },
        chip: {
          color: 'primary',
        },
        paper: {
          sx: {
            '& .MuiAutocomplete-listbox': {
              p: 0,
            },
          },
        },
      }}
      sx={{ '& fieldset': { borderRadius: 2 } }}
      value={value}
    />
  );
};

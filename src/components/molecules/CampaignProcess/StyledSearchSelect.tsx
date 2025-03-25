import { FC } from 'react';
import { Autocomplete, Box, Checkbox, Chip, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { TreeNodeRenderTypeEnum } from '@/components/molecules';
import { SelectWithFlagTypeEnum } from '@/types';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const StyledChip = styled(Chip)({
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
  onInputKeyDown: (data: any[]) => void;
  onSelect: (data: any[]) => void;
  onDelete: (value: string) => void;
  onReset: () => void;
  type?: TreeNodeRenderTypeEnum;
  id: string;
  disabled?: boolean;
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
}) => {
  return (
    <Autocomplete
      disableCloseOnSelect
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      id={id}
      multiple
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
              onInputKeyDown([
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
                onDelete(option.value);
              } else {
                onSelect([
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
            <Checkbox
              checked={value.some((item) => item.value === option.value)}
              checkedIcon={checkedIcon}
              icon={icon}
              style={{ marginRight: 8 }}
            />
            {option.label}
          </Box>
        );
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <StyledChip
            {...getTagProps({ index })}
            deleteIcon={<ClearIcon />}
            key={`${option.key}-chip-${index}-key`}
            label={`${option.label}`}
            onDelete={() => {
              onDelete(option.value);
            }}
            variant="filled"
          />
        ));
      }}
      slotProps={{
        clearIndicator: {
          onClick: () => onReset(),
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

//type === TreeNodeRenderTypeEnum.search_select ? (
//  <li
//    {...props}
//    key={`${option.key}-input-key`}
//    style={{
//      display: 'flex',
//      alignItems: 'center',
//      justifyContent: 'space-between',
//    }}
//  >
//    <Typography>{option.label}</Typography>
//
//    <Stack
//      alignItems={'center'}
//      flexDirection={'row'}
//      gap={1.25}
//      mr={6}
//    >
//      <Typography
//        borderRadius={1}
//        color={'#6E4EFB'}
//        onClick={() => {
//          const target = value.find(
//            (item) => item.value === option.value,
//          );
//          if (target) {
//            target.isIncludes = true;
//            onSelect([...value]);
//          } else {
//            onSelect([...value, { ...option, isIncludes: true }]);
//          }
//        }}
//        p={0.5}
//        sx={() => {
//          const target = value.find(
//            (item) => item.value === option.value,
//          );
//          if (!target) {
//            return {};
//          }
//          return {
//            bgcolor: target.isIncludes ? '#E9F1FF' : 'transparent',
//          };
//        }}
//        variant={'body3'}
//      >
//        Include
//      </Typography>
//      <Box bgcolor={'#4C4957'} height={20} width={'1px'} />
//      <Typography
//        borderRadius={1}
//        color={'#E26E6E'}
//        onClick={() => {
//          const target = value.find(
//            (item) => item.value === option.value,
//          );
//          if (target) {
//            target.isIncludes = false;
//            onSelect([...value]);
//          } else {
//            onSelect([...value, { ...option, isIncludes: false }]);
//          }
//        }}
//        p={0.5}
//        sx={() => {
//          const target = value.find(
//            (item) => item.value === option.value,
//          );
//          if (!target) {
//            return {};
//          }
//          return {
//            bgcolor: target.isIncludes ? 'transparent' : '#FEEFED',
//          };
//        }}
//        variant={'body3'}
//      >
//        Exclude
//      </Typography>
//    </Stack>
//  </li>
//) : ()

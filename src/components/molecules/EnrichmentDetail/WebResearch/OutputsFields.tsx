import {
  Box,
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { debounce } from 'lodash-es';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { StyledTextField } from '@/components/atoms';
import { CommonSelectFieldType } from '@/components/molecules/Common';

import { TableColumnTypeEnum } from '@/types/enrichment/table';

import ICON_DELETE from './assets/icon_delete.svg';

interface SelectOption {
  label: string;
  value: string;
  key: string;
}

interface OutputsFieldsProps {
  fieldName: string;
  fieldType: string;
  fieldDescription: string;
  saveField: (
    fieldName: string,
    newName: string,
    newDescription: string,
    newType: string,
    newSelectOptions: SelectOption[],
  ) => void;
  removeField: (fieldName: string) => void;
  selectOptions: SelectOption[];
}

export const OutputsFields = ({
  fieldName,
  fieldType,
  fieldDescription,
  saveField,
  removeField,
  selectOptions,
}: OutputsFieldsProps) => {
  const [name, setName] = useState(fieldName);
  const [type, setType] = useState(fieldType || TableColumnTypeEnum.text);
  const [description, setDescription] = useState(fieldDescription);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setName(fieldName);
    setType(fieldType || TableColumnTypeEnum.text);
    setDescription(fieldDescription);
  }, [fieldName, fieldType, fieldDescription]);

  const debouncedSave = useMemo(
    () =>
      debounce(
        (
          newName: string,
          newDesc: string,
          newType: string,
          newOptions: SelectOption[],
        ) => {
          // 字段名只能是字母数字，其他字符替换成 "_"
          saveField(
            fieldName,
            newName.replace(/[^a-zA-Z0-9]/g, '_'),
            newDesc,
            newType,
            newOptions,
          );
        },
        200,
      ),
    [saveField, fieldName],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      debouncedSave(e.target.value, description, type, selectOptions);
    },
    [debouncedSave, description, type, selectOptions],
  );

  const onTypeChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setType(e.target.value as TableColumnTypeEnum);
  }, []);

  const onClickToOpenMenu = useCallback((e: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(e.currentTarget as unknown as HTMLElement);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
      debouncedSave(name, e.target.value, type, selectOptions);
    },
    [debouncedSave, name, type, selectOptions],
  );

  const onClickToRemove = useCallback(() => {
    removeField(fieldName);
  }, [removeField, fieldName]);

  return (
    <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
      <StyledTextField onChange={onNameChange} value={name} />
      <CommonSelectFieldType onChange={onTypeChange} value={type} />
      <MoreHoriz
        onClick={onClickToOpenMenu}
        sx={{
          fontSize: 20,
          color: 'text.primary',
          cursor: 'pointer',
        }}
      />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={onMenuClose}
        open={Boolean(anchorEl)}
        slotProps={{
          list: {
            sx: {
              p: 1.5,
              width: 240,
              [`& .${menuItemClasses.root}`]: {
                gap: 1,
                '&:hover': {
                  bgcolor: 'unset !important',
                  cursor: 'unset',
                },
              },
            },
          },
        }}
      >
        <MenuItem>
          <Stack gap={1.25} width={200}>
            <Typography variant={'body3'}>
              Output description (helps AI)
            </Typography>
            <StyledTextField
              maxRows={3}
              minRows={3}
              multiline
              onChange={onDescriptionChange}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontSize: 12,
                },
              }}
              value={description}
            />
            <Box bgcolor={'#D0CEDA'} height={'1px'} />
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              onClick={onClickToRemove}
              sx={{ cursor: 'pointer' }}
            >
              <Icon component={ICON_DELETE} sx={{ width: 20, height: 20 }} />
              <Typography color={'#D75B5B'} variant={'body2'}>
                Delete
              </Typography>
            </Stack>
          </Stack>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

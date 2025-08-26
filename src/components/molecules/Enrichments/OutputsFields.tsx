import {
  Box,
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import { StyledSelect, StyledTextField } from '@/components/atoms';

import { MoreHoriz } from '@mui/icons-material';
import ICON_TEXT from './assets/icon_text.svg';
import ICON_DELETE from './assets/icon_delete.svg';
import { debounce } from 'lodash-es';

type OutputsFieldsProps = {
  fieldName: string;
  fieldType: string;
  fieldDescription: string;
  saveField: (
    fieldName: string,
    newName: string,
    newDescription: string,
    newType: string,
    newSelectOptions: any,
  ) => void;
  removeField: () => void;
  selectOptions: any;
};

export const OutputsFields = ({
  fieldName,
  fieldType,
  fieldDescription,
  saveField,
  removeField,
  selectOptions,
}: OutputsFieldsProps) => {
  const [name, setName] = useState(fieldName);
  const [type, setType] = useState(fieldType || 'text');
  const [description, setDescription] = useState(fieldDescription);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setName(fieldName);
    setType(fieldType || 'text');
    setDescription(fieldDescription);
  }, [fieldName, fieldType, fieldDescription]);

  const debouncedSave = useMemo(
    () =>
      debounce((newName, newDesc, newType, newOptions) => {
        // 字段名只能是字母数字，其他字符替换成 "_"
        saveField(
          fieldName,
          newName.replace(/[^a-zA-Z0-9]/g, '_'),
          newDesc,
          newType,
          newOptions,
        );
      }, 200),
    [saveField, fieldName],
  );

  return (
    <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
      <StyledTextField
        onChange={(e) => {
          setName(e.target.value);
          debouncedSave(e.target.value, description, type, selectOptions);
        }}
        value={name}
      />
      <StyledSelect
        onChange={(e) => {
          setType(e.target.value as string);
          saveField(
            fieldName,
            name,
            description,
            e.target.value as string,
            selectOptions,
          );
        }}
        options={[
          {
            label: 'Text',
            value: 'text',
            key: 'text',
          },
        ]}
        placeholder={'Text'}
        startAdornment={
          <Icon component={ICON_TEXT} sx={{ width: 12, height: 12 }} />
        }
        value={type}
      />
      <MoreHoriz
        onClick={(e) => {
          setAnchorEl((e as any).currentTarget);
        }}
        sx={{
          fontSize: 20,
          color: 'text.primary',
          cursor: 'pointer',
        }}
      />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => {
          setAnchorEl(null);
        }}
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
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontSize: 12,
                },
              }}
            />

            <Box bgcolor={'#D0CEDA'} height={'1px'}></Box>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              onClick={() => {}}
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

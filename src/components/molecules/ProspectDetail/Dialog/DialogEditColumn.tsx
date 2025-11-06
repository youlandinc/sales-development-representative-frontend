import { StyledButton, StyledSelect } from '@/components/atoms';
import { COLUMN_TYPE_ICONS } from '@/components/atoms/StyledTable/columnTypeIcons';
import { useProspectTableStore } from '@/stores/Prospect';
import { TableColumnTypeEnum } from '@/types/Prospect/table';
import { Drawer, Icon, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { CommonSelectFieldType } from '../../Common';

export const DialogEditColumn: FC = () => {
  const { columns, activeColumnId } = useProspectTableStore((store) => store);
  const column = columns.find((col) => col.fieldId === activeColumnId);

  const [value, setValue] = useState(TableColumnTypeEnum.text);
  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      //   open
      slotProps={{
        paper: {
          sx: {
            maxWidth: 500,
            width: '100%',
          },
        },
      }}
      sx={{
        left: 'unset',
      }}
    >
      <Stack height={'100%'}>
        {/* header */}
        <Stack alignItems={'center'} flexDirection={'row'}>
          {column?.fieldType && (
            <Icon
              component={
                COLUMN_TYPE_ICONS[column?.fieldType as TableColumnTypeEnum] ||
                COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
              }
              sx={{ width: 16, height: 16 }}
            />
          )}
        </Stack>
        <Stack gap={1} px={3} py={1.5}>
          <Typography color={'text.secondary'} variant={'body2'}>
            Data type
          </Typography>
          <CommonSelectFieldType
            onChange={(e) => setValue(e.target.value as TableColumnTypeEnum)}
            value={value}
          />
        </Stack>
        <Stack
          alignItems={'center'}
          borderTop={' 1px solid   #D0CEDA'}
          flexDirection={'row'}
          gap={1}
          justifyContent={'flex-end'}
          mt={'auto'}
          px={3}
          py={1.5}
        >
          <StyledButton
            color={'info'}
            //   onClick={handleClose}
            size={'medium'}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            //   loading={state.loading}
            //   onClick={() => {
            //     updateDescription(description);
            //   }}
            size={'medium'}
            sx={{ width: 143 }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Drawer>
  );
};

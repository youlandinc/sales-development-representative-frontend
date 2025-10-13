import { StyledButton } from '@/components/atoms';
import { COINS_PER_ROW } from '@/constant';
import {
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { useProspectTableStore } from '@/stores/Prospect';
import { CostCoins } from '../DialogWebResearch';

import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailFooter: FC = () => {
  const { rowIds } = useProspectTableStore((store) => store);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
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
      <CostCoins
        border={'1px solid #D0CEDA'}
        count={`${COINS_PER_ROW}`}
        textColor={'text.secondary'}
      />
      <StyledButton
        endIcon={
          <Icon
            component={ICON_ARROW}
            sx={{ width: 12, height: 12, '& path': { fill: '#fff' } }}
          />
        }
        loading={false}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        size={'medium'}
        sx={{ height: '40px !important', width: 80 }}
        variant={'contained'}
      >
        Save
      </StyledButton>
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
              p: 0,
              width: 400,
              [`& .${menuItemClasses.root}`]: {
                justifyContent: 'space-between',
              },
            },
          },
        }}
      >
        {rowIds.length > 10 && (
          <MenuItem
            onClick={() => {
              return;
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run 10 rows
            </Typography>
            <CostCoins bgcolor={'#EFE9FB'} count={`~${COINS_PER_ROW * 10}`} />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            //   saveAndRun(tableId, rowIds.length);
            return;
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and run {rowIds.length} rows in this view
          </Typography>
          <CostCoins bgcolor={'#EFE9FB'} count={'~20'} />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            //   try {
            //     if (activeType === ActiveTypeEnum.add) {
            //       await saveDoNotRun(tableId);
            //     }
            //     if (activeType === ActiveTypeEnum.edit) {
            //       await updateAiConfig(tableId);
            //     }
            //     await cb?.();
            //     handleClose();
            //   } catch (err) {
            //     const { header, message, variant } = err as HttpError;
            //     SDRToast({ message, header, variant });
            //   }
            return;
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and don&#39;t run
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

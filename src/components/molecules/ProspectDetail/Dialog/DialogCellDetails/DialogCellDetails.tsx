import {
  debounce,
  Drawer,
  DrawerProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import {
  StyledCellDetailsArray,
  StyledCellItemContainer,
  TableColumnMenuEnum,
} from '@/components/molecules';

import { useProspectTableStore } from '@/stores/Prospect';

import { HttpVariantEnum } from '@/types';

import ICON_SPARK from '@/components/molecules/ProspectDetail/assets/dialog/icon_sparkle.svg';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import { StyledCellDetailsObj } from './StyledCellDetailsObj';

type CellDetailsProps = {
  data: Record<string, any>;
} & DrawerProps;
export const DialogCellDetails: FC<CellDetailsProps> = ({ data, ...rest }) => {
  const { dialogType, closeDialog, dialogVisible } = useProspectTableStore(
    (store) => store,
  );

  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const debounceSearch = useMemo(() => {
    return debounce((text: string) => {
      setFilter(text);
    }, 400);
  }, []);

  const handleClose = () => {
    closeDialog();
  };

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      open={dialogVisible && dialogType === TableColumnMenuEnum.cell_detail}
      sx={{
        left: 'unset',
      }}
      {...rest}
    >
      <Stack height={'100%'} justifyContent={'space-between'}>
        {/* header */}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          px={3}
          py={2}
          width={500}
        >
          <Icon
            component={ICON_SPARK}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography fontWeight={600} mr={1}>
            Cell details
          </Typography>
          <StyledButton
            color={'info'}
            endIcon={<ContentCopyIcon sx={{ width: 12, height: 12 }} />}
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(data));
              SDRToast({
                message: 'Copied to Clipboard',
                header: false,
                variant: 'success' as HttpVariantEnum,
              });
            }}
            size={'small'}
            variant={'outlined'}
          >
            Copy JSON
          </StyledButton>
          <CloseIcon
            onClick={handleClose}
            sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
        {/* content */}
        <Stack flex={1} gap={1.5} maxWidth={500} px={3} py={1} width={500}>
          <StyledTextField
            onChange={(e) => {
              setText(e.target.value);
              debounceSearch(e.target.value);
            }}
            placeholder={'Search'}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary' }} />,
              },
            }}
            sx={{
              bgcolor: '#FFF',
            }}
            value={text}
            variant={'outlined'}
          />
          {Object.entries(data)
            .filter(([key, value]) => {
              const text = filter.toLowerCase();
              if (Array.isArray(value)) {
                return value.join('').includes(text);
              }
              return (
                key.toLowerCase().includes(text) ||
                value.toLowerCase().includes(text)
              );
            })
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return (
                  <StyledCellDetailsArray
                    key={key}
                    title={key}
                    value={value as string[]}
                  />
                );
              }
              if (Object.prototype.toString.call(value) === '[object Object]') {
                return (
                  <StyledCellDetailsObj
                    key={key}
                    title={key}
                    value={value as Record<string, any>}
                  />
                );
              }
              return (
                <StyledCellItemContainer copyContent={value} key={key}>
                  <Stack gap={1} key={key} width={'fit-content'}>
                    <Typography variant={'body2'}>{key}</Typography>
                    <Typography color={'text.secondary'} variant={'body3'}>
                      {value}
                    </Typography>
                  </Stack>
                </StyledCellItemContainer>
              );
            })}
        </Stack>
        {/* footer */}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={48}
          px={3}
        ></Stack>
      </Stack>
    </Drawer>
  );
};

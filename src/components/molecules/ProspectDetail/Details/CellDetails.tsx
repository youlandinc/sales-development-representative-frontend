import { FC, PropsWithChildren, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerProps,
  Icon,
  IconButton,
  Stack,
  StackProps,
  Typography,
} from '@mui/material';
import { debounce } from 'lodash-es';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import { useSwitch } from '@/hooks/useSwitch';

import { HttpVariantEnum } from '@/types';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import ICON_SPARK from './assets/icon_sparkle.svg';

const CellItemContainer: FC<
  PropsWithChildren & StackProps & { showCopy?: boolean; copyContent?: string }
> = ({ children, showCopy = true, copyContent, ...rest }) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#F8F8FA'}
      border={'1px solid #E5E5E5'}
      borderRadius={2}
      flexDirection={'row'}
      position={'relative'}
      px={1}
      py={0.5}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          borderColor: '#6E4EFB',
          bgcolor: '#F7F4FD',
          '& .icon_copy': {
            display: 'block',
          },
        },
      }}
      {...rest}
    >
      {children}
      {showCopy && (
        <ContentCopyIcon
          className={'icon_copy'}
          onClick={async () => {
            await navigator.clipboard.writeText(copyContent || '');
            SDRToast({
              message: 'Copied to Clipboard',
              header: false,
              variant: 'success' as HttpVariantEnum,
            });
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 12,
            display: 'none',
          }}
        />
      )}
    </Stack>
  );
};

type CellDetailsArrayProps = {
  title: string;
  value: string[];
};
export const CellDetailsArray: FC<CellDetailsArrayProps> = ({
  title,
  value,
}) => {
  const { visible, toggle } = useSwitch();
  return (
    <Stack gap={1}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <IconButton onClick={toggle}>
          <KeyboardArrowRightIcon
            sx={{
              transform: visible ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: '.3s all',
            }}
          />
        </IconButton>
        <CellItemContainer showCopy={false}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            onClick={toggle}
            sx={{
              cursor: 'pointer',
              userSelect: 'none',
            }}
            width={'fit-content'}
          >
            <Typography variant={'body3'}>[ ]</Typography>
            <Typography variant={'body2'}>{title}</Typography>
            <Typography color={'text.secondary'} variant={'body3'}>
              [ {value.length} ]
            </Typography>
          </Stack>
        </CellItemContainer>
      </Stack>
      {visible && (
        <Stack gap={1.5} ml={2}>
          {value.map((item, index) => (
            <CellItemContainer copyContent={item} key={index}>
              <Typography color={'text.secondary'} variant={'body3'}>
                {item}
              </Typography>
            </CellItemContainer>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

type CellDetailsProps = {
  data: Record<string, any>;
} & DrawerProps;
export const CellDetails: FC<CellDetailsProps> = ({ data, ...rest }) => {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const debounceSearch = useMemo(() => {
    return debounce((text: string) => {
      setFilter(text);
    }, 400);
  }, []);

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
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
          {/* <Icon*/}
          {/*  component={ICON_ARROW}*/}
          {/*  onClick={handleClose}*/}
          {/*  sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}*/}
          {/*/>*/}
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
            onClick={() => {
              rest?.onClose?.({}, 'backdropClick');
            }}
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
                  <CellDetailsArray
                    key={key}
                    title={key}
                    value={value as string[]}
                  />
                );
              }
              return (
                <CellItemContainer copyContent={value} key={key}>
                  <Stack gap={1} key={key} width={'fit-content'}>
                    <Typography variant={'body2'}>{key}</Typography>
                    <Typography color={'text.secondary'} variant={'body3'}>
                      {value}
                    </Typography>
                  </Stack>
                </CellItemContainer>
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

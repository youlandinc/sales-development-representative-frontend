import { FC, PropsWithChildren, useMemo, useState } from 'react';
import {
  Drawer,
  IconButton,
  Stack,
  StackProps,
  Typography,
} from '@mui/material';
import { debounce } from 'lodash-es';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import { useSwitch } from '@/hooks/useSwitch';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import { HttpVariantEnum } from '@/types';

const mockData = {
  reasoning:
    "Natalie Varichak's contact information, including her email and phone number, was found on RocketReach. Her LinkedIn profile confirms her current position at Absolute Resolutions Corporation, and RocketReach provides detailed contact information.",
  confidence: 'high',
  stepsTaken: ['https://rocketreach.co/natalie-varichak-email_686468991'],
  'Phone Number': '602793XXXX',
  'Email Address': 'natalie@absoluteresolutions.com',
  'Email  Address': '[email protected]',
  'Phone  Number': '602-793-8888',
};

const CellItemContainer: FC<PropsWithChildren & StackProps> = ({
  children,
  ...rest
}) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#FFFFFF'}
      border={'1px solid ##1525431a'}
      borderRadius={1}
      flexDirection={'row'}
      px={1}
      py={0.5}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
      }}
      width={'fit-content'}
      {...rest}
    >
      {children}
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
        <CellItemContainer>
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
            <Typography variant={'subtitle2'}>{title}</Typography>
            <Typography color={'text.secondary'} variant={'body2'}>
              [ {value.length} ]
            </Typography>
          </Stack>
        </CellItemContainer>
      </Stack>
      {visible && (
        <Stack ml={2}>
          {value.map((item, index) => (
            <CellItemContainer key={index}>
              <Typography color={'text.secondary'} variant={'body2'}>
                {item}
              </Typography>
            </CellItemContainer>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export const CellDetails = () => {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const debounceSearch = useMemo(() => {
    return debounce((text: string) => {
      setFilter(text);
    }, 400);
  }, []);

  return (
    <Drawer anchor={'right'} hideBackdrop open>
      <Stack height={'100%'} justifyContent={'space-between'}>
        {/* header */}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          px={3}
          py={2}
          width={500}
        >
          {/* <Icon
            component={ICON_ARROW}
            onClick={handleClose}
            sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
          />
          <Icon
            component={ICON_SPARK}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          /> */}
          <Typography mr={1}>Cell details</Typography>
          <StyledButton
            color={'info'}
            endIcon={<ContentCopyIcon sx={{ width: 12, height: 12 }} />}
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(mockData));
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
            // onClick={handleClose}
            sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
        {/* content */}
        <Stack
          bgcolor={'#F5F5F5'}
          flex={1}
          gap={1}
          maxWidth={500}
          px={3}
          py={1}
          width={500}
        >
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
          {Object.entries(mockData)
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
                <CellItemContainer>
                  <Stack
                    flexDirection={'row'}
                    gap={1}
                    key={key}
                    width={'fit-content'}
                  >
                    <Typography variant={'subtitle2'}>{key}</Typography>
                    <Typography color={'text.secondary'} variant={'body2'}>
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

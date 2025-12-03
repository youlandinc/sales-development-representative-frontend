import { FC, useState } from 'react';
import { Drawer, Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledTextField } from '@/components/atoms';

import { useSwitch } from '@/hooks/useSwitch';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
        <KeyboardArrowRightIcon
          sx={{
            transform: visible ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: '.3s all',
          }}
        />
        <Stack
          alignItems={'center'}
          bgcolor={'#FFFFFF'}
          border={'1px solid ##1525431a'}
          borderRadius={1}
          flexDirection={'row'}
          gap={1}
          onClick={toggle}
          px={1}
          py={0.5}
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
      </Stack>
      {visible && (
        <Stack ml={2}>
          {value.map((item, index) => (
            <Stack
              alignItems={'center'}
              bgcolor={'#FFFFFF'}
              border={'1px solid ##1525431a'}
              borderRadius={1}
              flexDirection={'row'}
              gap={1}
              key={index}
              px={1}
              py={0.5}
              sx={{
                cursor: 'pointer',
              }}
              width={'fit-content'}
            >
              <Typography color={'text.secondary'} variant={'body2'}>
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export const CellDetails = (props: any) => {
  const [filter, setFilter] = useState('');
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
          <StyledButton color={'info'} size={'small'} variant={'outlined'}>
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
            onChange={(e) => setFilter(e.target.value)}
            placeholder={'Reasoning'}
            value={filter}
            variant={'outlined'}
          />
          {Object.entries(mockData)
            .filter(([key, value]) => {
              if (Array.isArray(value)) {
                return value.some((item) =>
                  item.toLowerCase().includes(filter.toLowerCase()),
                );
              }
              return key.toLowerCase().includes(filter.toLowerCase());
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
                <Stack
                  bgcolor={'#FFFFFF'}
                  border={'1px solid ##1525431a'}
                  borderRadius={1}
                  flexDirection={'row'}
                  gap={1}
                  key={key}
                  px={1}
                  py={0.5}
                  width={'fit-content'}
                >
                  <Typography variant={'subtitle2'}>{key}</Typography>
                  <Typography color={'text.secondary'} variant={'body2'}>
                    {value}
                  </Typography>
                </Stack>
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

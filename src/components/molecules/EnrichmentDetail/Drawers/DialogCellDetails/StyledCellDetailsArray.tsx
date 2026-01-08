import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledCellItemContainer } from './index';

import { useSwitch } from '@/hooks/useSwitch';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { StyledCellDetailsObj } from './StyledCellDetailsObj';

type StyledCellDetailsArrayProps = {
  title: string;
  value: unknown[];
};
export const StyledCellDetailsArray: FC<StyledCellDetailsArrayProps> = ({
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
        <StyledCellItemContainer showCopy={false}>
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
        </StyledCellItemContainer>
      </Stack>
      {visible && (
        <Stack gap={1.5} ml={2}>
          {value.map((item, index) => {
            if (Array.isArray(item)) {
              return (
                <StyledCellDetailsArray
                  key={index}
                  title={item.toString()}
                  value={item}
                />
              );
            }
            if (Object.prototype.toString.call(item) === '[object Object]') {
              return (
                <StyledCellDetailsObj
                  key={index}
                  title={index.toString()}
                  value={item as Record<string, any>}
                />
              );
            }
            return (
              <StyledCellItemContainer copyContent={item as string} key={index}>
                <Typography
                  color={'text.secondary'}
                  component={'p'}
                  variant={'body3'}
                >
                  {item as string}
                </Typography>
              </StyledCellItemContainer>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

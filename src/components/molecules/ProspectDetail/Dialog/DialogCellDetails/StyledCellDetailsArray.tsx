import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledCellItemContainer } from './index';

import { useSwitch } from '@/hooks/useSwitch';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type StyledCellDetailsArrayProps = {
  title: string;
  value: string[];
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
          {value.map((item, index) => (
            <StyledCellItemContainer copyContent={item} key={index}>
              <Typography color={'text.secondary'} variant={'body3'}>
                {typeof item === 'object' ? JSON.stringify(item) : item}
              </Typography>
            </StyledCellItemContainer>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledCellItemContainer } from './index';

import { useSwitch } from '@/hooks/useSwitch';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type StyledCellDetailsObjProps = {
  title: string;
  value: Record<string, any>;
};
export const StyledCellDetailsObj: FC<StyledCellDetailsObjProps> = ({
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
            <Typography fontWeight={600} variant={'body3'}>
              {'{ }'}
            </Typography>
            <Typography variant={'body2'}>{title}</Typography>
            <Typography color={'text.secondary'} variant={'body3'}>
              {`{ ${Object.keys(value).length} }`}
            </Typography>
          </Stack>
        </StyledCellItemContainer>
      </Stack>
      {visible && (
        <Stack gap={1.5} ml={2}>
          {Object.entries(value).map(([key, value], index) => (
            <StyledCellItemContainer copyContent={value} key={index}>
              <Stack gap={1} key={key} width={'fit-content'}>
                <Typography variant={'body2'}>{key}</Typography>
                <Typography color={'text.secondary'} variant={'body3'}>
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </Typography>
              </Stack>
            </StyledCellItemContainer>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

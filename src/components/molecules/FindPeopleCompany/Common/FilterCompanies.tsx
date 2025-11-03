import { useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledDialog, StyledRadioGroup } from '@/components/atoms';
import { FilterContainer, FilterTextField } from './index';

const COMPANIES_OPTIONS = [
  {
    label: 'SalesOS table of companies',
    key: 'table',
    value: 'table',
  },
  {
    label: 'List of company identifiers',
    key: 'list',
    value: 'list',
  },
];

import ICON_CLOSE from './assets/icon-close.svg';
import ICON_FOLDER from './assets/icon-folder.svg';
import ICON_MORE from './assets/icon-more.svg';
import { useSwitch } from '@/hooks';

export const FilterCompanies = () => {
  const [radioValue, setRadioValue] = useState('list');
  const { open, visible, close } = useSwitch(false);

  return (
    <Stack gap={1.5}>
      <StyledRadioGroup
        onChange={(_, val) => {
          setRadioValue(val);
        }}
        options={COMPANIES_OPTIONS}
        value={radioValue}
      />
      <Stack>
        <FilterContainer title={'Company table'}>
          <Stack flexDirection={'row'} gap={1.5}>
            <Stack
              sx={{
                px: 1.5,
                gap: 1.5,
                height: 32,
                borderRadius: 2,
                border: '1px solid #E5E5E5',
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Icon
                component={ICON_FOLDER}
                sx={{ width: 16, height: 16, flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  py: 0.5,
                  cursor: 'pointer',
                }}
              >
                Select people table
              </Typography>
              <Stack flexDirection={'row'} gap={1.5} ml={'auto'}>
                <Icon
                  component={ICON_FOLDER}
                  sx={{
                    width: 16,
                    height: 16,
                    cursor: 'pointer',
                    '&:hover': {
                      '& path': {
                        fill: '#363440',
                      },
                    },
                  }}
                />
                <Icon
                  component={ICON_CLOSE}
                  sx={{
                    width: 16,
                    height: 16,
                    cursor: 'pointer',
                    '& path': {
                      fill: '#6F6C7D',
                    },
                    '&:hover': {
                      '& path': {
                        fill: '#363440',
                      },
                    },
                  }}
                />
              </Stack>
            </Stack>
            <Stack
              sx={{
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                height: 32,
                width: 32,
                borderRadius: 2,
                border: '1px solid #E5E5E5',
              }}
            >
              <Icon component={ICON_MORE} sx={{ width: 16, height: 16 }} />
            </Stack>
          </Stack>
        </FilterContainer>
        <StyledDialog
          content={<></>}
          footer={<></>}
          header={<></>}
          open={visible}
        />
      </Stack>
      <Stack>
        <FilterTextField
          onChange={(e) => {
            console.log(e);
          }}
          subTitle={'Company Linkedin URLs, domains'}
          title={'Companies'}
        />
      </Stack>
    </Stack>
  );
};

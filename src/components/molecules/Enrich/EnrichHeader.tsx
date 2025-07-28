import { FC } from 'react';
import { Icon, InputAdornment, Stack, Typography } from '@mui/material';

import { StyledButton, StyledTextField } from '@/components/atoms';

import ICON_FIND_PEOPLE from './assets/icon_find_people.svg';
import ICON_FIND_COMPANIES from './assets/icon_find_companies.svg';
import ICON_IMPORT_CSV from './assets/icon_import_csv.svg';
import ICON_BLANK_TABLE from './assets/icon_blank_table.svg';

import ICON_HEADER_SEARCH from './assets/icon_search.svg';
import ICON_NEW_TABLE from './assets/icon_new_table.svg';

const BUTTONS = [
  {
    label: 'Find people',
    icon: ICON_FIND_PEOPLE,
    disabled: true,
  },
  {
    label: 'Find companies',
    icon: ICON_FIND_COMPANIES,
    disabled: true,
  },
  {
    label: 'Import from CSV',
    icon: ICON_IMPORT_CSV,
    disabled: false,
  },
  {
    label: 'Blank table',
    icon: ICON_BLANK_TABLE,
    disabled: true,
  },
];

export const EnrichHeader: FC = () => {
  return (
    <Stack gap={3}>
      <Stack gap={1.5}>
        <Typography variant={'h5'}>Quick start</Typography>
        <Stack flexDirection={'row'} gap={3}>
          {BUTTONS.map((item, index) => (
            <StyledButton
              color={'info'}
              disabled={item.disabled}
              key={`${item.label}-${index}`}
              size={'medium'}
              sx={{
                width: '180px !important',
                fontWeight: 400,
                justifyContent: 'flex-start',
              }}
              variant={'outlined'}
            >
              <Icon
                component={item.icon}
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  '& path': {
                    fill: item.disabled ? '#BABCBE' : '#2A292E',
                  },
                }}
              />
              {item.label}
            </StyledButton>
          ))}
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Prospect & Enrich</Typography>

        <Stack flexDirection={'row'} gap={1}>
          <StyledTextField
            //onChange={onChange}
            size={'small'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment
                    position={'start'}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      component={ICON_HEADER_SEARCH}
                      sx={{ width: 16, height: 16 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            //value={value}
          />
          <StyledButton size={'medium'}>
            <Icon
              component={ICON_NEW_TABLE}
              sx={{ width: 20, height: 20, mr: 1 }}
            />
            New table
          </StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

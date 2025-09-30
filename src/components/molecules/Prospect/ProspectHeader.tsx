import {
  debounce,
  Icon,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { StyledButton, StyledTextField } from '@/components/atoms';

import ICON_BLANK_TABLE from './assets/icon_blank_table.svg';
import ICON_FIND_COMPANIES from './assets/icon_find_companies.svg';
import ICON_FIND_PEOPLE from './assets/icon_find_people.svg';
import ICON_IMPORT_CSV from './assets/icon_import_csv.svg';

import ICON_HEADER_SEARCH from './assets/icon_search.svg';
import ICON_NEW_TABLE from './assets/icon_new_table.svg';
import { DialogCompanyType } from '@/components/molecules';
import { useFindCompaniesStore } from '@/stores/useFindCompiesStore';

interface ProspectHeaderProps {
  dispatch: any;
  store: { searchWord: string };
  openDialog: () => void;
}

export const ProspectHeader: FC<ProspectHeaderProps> = ({
  dispatch,
  store,
  openDialog,
}) => {
  const { setDialogCompanyTypeOpen, setFilters } = useFindCompaniesStore(
    (store) => store,
  );
  const [value, setValue] = useState(store.searchWord);
  const router = useRouter();

  const BUTTONS = useMemo(
    () => [
      {
        label: 'Find people',
        icon: ICON_FIND_PEOPLE,
        disabled: false,
        handleClick: () => router.push('/find-people'),
      },
      {
        label: 'Find companies',
        icon: ICON_FIND_COMPANIES,
        disabled: false,
        handleClick: () => setDialogCompanyTypeOpen(true),
      },
      {
        label: 'Import from CSV',
        icon: ICON_IMPORT_CSV,
        disabled: false,
        handleClick: openDialog,
      },
      {
        label: 'Blank table',
        icon: ICON_BLANK_TABLE,
        disabled: true,
      },
    ],
    [],
  );

  const debounceSearchWord = useMemo(
    () =>
      debounce((value) => {
        dispatch({ type: 'change', payload: { field: 'searchWord', value } });
      }, 500),
    [dispatch],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounceSearchWord(e.target.value);
  };

  return (
    <Stack gap={6}>
      <Stack gap={1.5}>
        <Typography variant={'h5'}>Quick start</Typography>
        <Stack flexDirection={'row'} gap={3}>
          {BUTTONS.map((item, index) => (
            <StyledButton
              color={'info'}
              disabled={item.disabled}
              key={`${item.label}-${index}`}
              onClick={item.handleClick}
              sx={{
                fontSize: '14px !important',
                fontWeight: 400,
                boxShadow: 'none',
                borderColor: '#DFDEE6 !important',
                color: '#1E1645 !important',
              }}
              variant={'outlined'}
            >
              <Icon
                component={item.icon}
                sx={{
                  width: 20,
                  height: 20,
                  mr: 0.5,
                  '& path': {
                    fill: item.disabled ? '#BABCBE' : '#1E1645',
                  },
                }}
              />
              {item.label}
            </StyledButton>
          ))}
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} gap={3} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Prospect & Enrich</Typography>

        <Stack flexDirection={'row'} gap={1}>
          <StyledTextField
            onChange={onChange}
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
            value={value}
          />
          <StyledButton onClick={() => openDialog()} size={'medium'}>
            <Icon
              component={ICON_NEW_TABLE}
              sx={{ width: 20, height: 20, mr: 1 }}
            />
            New table
          </StyledButton>
        </Stack>
      </Stack>

      <DialogCompanyType
        cb={(type) => {
          setFilters('companyType', type);
          router.push('/find-companies');
        }}
      />
    </Stack>
  );
};

import {
  debounce,
  Divider,
  Icon,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, FC, MouseEvent, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { StyledButton, StyledTextField } from '@/components/atoms';
import { DialogCompanyType } from '@/components/molecules';

import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FindType } from '@/types';

import ICON_BLANK_TABLE from './assets/icon_blank_table.svg';
import ICON_FIND_COMPANIES from './assets/icon_find_companies.svg';
import ICON_FIND_PEOPLE from './assets/icon_find_people.svg';
import ICON_IMPORT_CSV from './assets/icon_import_csv.svg';
import ICON_NEW_TABLE from './assets/icon_new_table.svg';
import ICON_HEADER_SEARCH from './assets/icon_search.svg';

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
  const router = useRouter();
  const {
    setFindType,
    setDialogSourceFromOpen,
    findType,
    fetchSource,
    fetchFiltersByType,
  } = useFindPeopleCompanyStore((store) => store);

  const [value, setValue] = useState(store.searchWord);

  const sourceOptions = [
    {
      label: 'Find people',
      icon: ICON_FIND_PEOPLE,
      disabled: false,
      onClick: () => {
        setFindType(FindType.find_people);
        setDialogSourceFromOpen(true);
        // if (findType !== FindType.find_people) {
        fetchSource();
        // }
      },
    },
    {
      label: 'Find companies',
      icon: ICON_FIND_COMPANIES,
      disabled: false,
      onClick: () => {
        setFindType(FindType.find_company);
        setDialogSourceFromOpen(true);
        // if (findType !== FindType.find_company) {
        fetchSource();
        // }
      },
    },
    {
      label: 'Import from CSV',
      icon: ICON_IMPORT_CSV,
      disabled: false,
      onClick: openDialog,
    },
  ];

  const tableOptions = [
    {
      label: 'Blank table',
      icon: ICON_BLANK_TABLE,
      disabled: true,
      onClick: () => void 0,
    },
  ];

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const onMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack gap={6}>
      <Stack gap={1.5}>
        <Typography variant={'h5'}>Quick start</Typography>
        <Stack flexDirection={'row'} gap={3}>
          {[...sourceOptions, ...tableOptions].map((item, index) => (
            <StyledButton
              color={'info'}
              disabled={item.disabled}
              key={`${item.label}-${index}`}
              onClick={() => item?.onClick()}
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
          <StyledButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            id="basic-button"
            onClick={onMenuOpen}
            size={'medium'}
          >
            <Icon
              component={ICON_NEW_TABLE}
              sx={{ width: 20, height: 20, mr: 1 }}
            />
            New table
          </StyledButton>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            id="basic-menu"
            onClose={onMenuClose}
            open={open}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
                sx: {
                  p: 0,
                  width: 260,
                  gap: 1,
                  display: 'flex',
                  flexDirection: 'column',
                },
              },
              paper: {
                sx: {
                  p: 1.5,
                  mt: 1.5,
                },
              },
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Typography variant={'h7'}>Source</Typography>
            {sourceOptions.map((item, index) => (
              <MenuItem
                key={`${item.label}-${index}`}
                onClick={() => {
                  item?.onClick();
                  onMenuClose();
                }}
                sx={{
                  fontSize: 14,
                  lineHeight: 1,
                  p: 0.5,
                  borderRadius: 1,
                  alignItems: 'center',
                }}
              >
                <Icon
                  component={item.icon}
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                {item.label}
              </MenuItem>
            ))}
            <Divider />
            <Typography variant={'h7'}>Tables</Typography>
            {tableOptions.map((item, index) => (
              <MenuItem
                disabled
                key={`${item.label}-${index}`}
                sx={{
                  fontSize: 14,
                  lineHeight: 1,
                  p: 0.5,
                  borderRadius: 1,
                  alignItems: 'center',
                }}
              >
                <Icon
                  component={item.icon}
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>

      <DialogCompanyType
        cb={() => {
          if (findType === FindType.find_company) {
            router.push('/find-companies');
          }
          if (findType === FindType.find_people) {
            router.push('/find-people');
          }
          console.log('fetchFiltersByType');
          fetchFiltersByType();
        }}
      />
    </Stack>
  );
};

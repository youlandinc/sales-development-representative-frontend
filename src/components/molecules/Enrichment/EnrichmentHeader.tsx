import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  debounce,
  Divider,
  Icon,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { _createBlankEnrichmentTable } from '@/request';
import { HttpError } from '@/types';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import ICON_BLANK_TABLE from './assets/icon_blank_table.svg';
import ICON_IMPORT_CSV from './assets/icon_import_csv.svg';
import ICON_NEW_TABLE from './assets/icon_new_table.svg';
import ICON_DIRECTORY from './assets/icon_directory.svg';
import ICON_HEADER_SEARCH from './assets/icon_search.svg';

interface EnrichmentHeaderAction {
  type: 'change';
  payload: { field: string; value: string };
}

interface EnrichmentHeaderProps {
  dispatch: (action: EnrichmentHeaderAction) => void;
  store: { searchWord: string };
  openDialog: () => void;
}

export const EnrichmentHeader: FC<EnrichmentHeaderProps> = ({
  dispatch,
  store,
  openDialog,
}) => {
  const [value, setValue] = useState(store.searchWord);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  const onClickToCreateBlankTable = useCallback(async () => {
    if (isCreating) {
      return;
    }
    setIsCreating(true);
    try {
      const { data } = await _createBlankEnrichmentTable();
      router.push(`/enrichment/${data}`);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, router]);

  const sourceOptions = useMemo(
    () => [
      {
        label: 'Search directories',
        icon: ICON_DIRECTORY,
        disabled: false,
        onClick: () => router.push('/directories'),
      },
      {
        label: 'Import from CSV',
        icon: ICON_IMPORT_CSV,
        disabled: false,
        onClick: openDialog,
      },
    ],
    [openDialog, router],
  );

  const tableOptions = useMemo(
    () => [
      {
        label: 'Blank table',
        icon: ICON_BLANK_TABLE,
        disabled: isCreating,
        onClick: onClickToCreateBlankTable,
      },
    ],
    [isCreating, onClickToCreateBlankTable],
  );

  const debounceSearchWord = useMemo(
    () =>
      debounce((value) => {
        dispatch({ type: 'change', payload: { field: 'searchWord', value } });
      }, 500),
    [dispatch],
  );

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounceSearchWord(e.target.value);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const onMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack sx={{ gap: 6 }}>
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant={'h6'}>Quick start</Typography>
        <Stack sx={{ flexDirection: 'row', gap: 2 }}>
          {[...sourceOptions, ...tableOptions].map((item, index) => (
            <StyledButton
              color={'info'}
              disabled={item.disabled}
              key={`${item.label}-${index}`}
              onClick={() => item?.onClick()}
              size={'medium'}
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

      <Stack
        sx={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ lineHeight: 1 }} variant={'h6'}>
          Tables
        </Typography>

        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <StyledTextField
            label=""
            onChange={onSearchInputChange}
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
            aria-controls={isMenuOpen ? 'basic-menu' : undefined}
            aria-expanded={isMenuOpen ? 'true' : undefined}
            aria-haspopup="true"
            color={'primary'}
            id="basic-button"
            onClick={onMenuOpen}
            size={'small'}
            variant={'contained'}
          >
            <Icon
              component={ICON_NEW_TABLE}
              sx={{ width: 16, height: 16, mr: 0.5 }}
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
            open={isMenuOpen}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
                sx: {
                  p: 0,
                  width: 260,
                  gap: 0.5,
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
                  p: 0.25,
                  borderRadius: 1,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#F0F0F4',
                    p: 0.5,
                    mr: 1,
                    borderRadius: 1,
                  }}
                >
                  <Icon component={item.icon} sx={{ width: 20, height: 20 }} />
                </Box>
                {item.label}
              </MenuItem>
            ))}
            <Divider
              flexItem
              sx={{
                marginTop: '4px !important',
                marginBottom: '4px !important',
              }}
            />
            <Typography variant={'h7'}>Tables</Typography>
            {tableOptions.map((item, index) => (
              <MenuItem
                disabled={item.disabled}
                key={`${item.label}-${index}`}
                onClick={async () => {
                  await item?.onClick();
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
                <Box
                  sx={{
                    bgcolor: '#F0F0F4',
                    p: 0.25,
                    mr: 1,
                    borderRadius: 1,
                  }}
                >
                  <Icon component={item.icon} sx={{ width: 20, height: 20 }} />
                </Box>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>
    </Stack>
  );
};

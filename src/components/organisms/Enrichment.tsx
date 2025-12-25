import {
  DragEvent,
  FC,
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useSwitch } from '@/hooks';
import { ENRICHMENT_CSV_TYPE_OPTIONS } from '@/constants';

import {
  SDRToast,
  StyledButton,
  StyledCheckbox,
  StyledDialog,
} from '@/components/atoms';
import {
  EnrichmentHeader,
  EnrichmentList,
  StyledCustomButtonGroup,
} from '@/components/molecules';

import { _createEnrichmentTableViaCsv } from '@/request';
import { EnrichmentDelimiterEnum, HttpVariantEnum } from '@/types';

import ICON_UPLOAD from './assets/icon_upload.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import ICON_CSV from './assets/icon_csv.svg';

import ICON_CSV_NEW from './assets/icon_csv_new.svg';
import ICON_CSV_EXIST from './assets/icon_csv_exist.svg';

const reducer = (
  state: { searchWord: string },
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case 'change': {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    }
    default:
      return state;
  }
};

const initialState: { searchWord: string } = {
  searchWord: '',
};

export const Enrichment: FC = () => {
  const router = useRouter();
  const [store, dispatch] = useReducer(reducer, initialState);

  const { open, close, visible } = useSwitch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [delimiter, setDelimiter] = useState<EnrichmentDelimiterEnum>(
    EnrichmentDelimiterEnum.comma,
  );
  const [hasHeader, setHasHeader] = useState(true);
  //const [tableId, setTableId] = useState<string>('');

  const validatorFileSize = useCallback((file: File): boolean => {
    const maxSizeMB = 10;
    if (file.size / 1024 / 1024 > maxSizeMB) {
      SDRToast({
        header: 'Upload Failed',
        message: `File size cannot exceed ${maxSizeMB}MB.`,
        variant: HttpVariantEnum.error,
      });
      return false;
    }
    return true;
  }, []);

  const stopDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEvents = {
    onMouseLeave: () => {
      setIsDragging(false);
    },
    onDragEnter: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
    onDragLeave: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(false);
    },
    onDragOver: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
    onDrop: async (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      resetFileInput();

      if (e.dataTransfer.files?.length) {
        const file = e.dataTransfer.files[0];
        if (validatorFileSize(file)) {
          onFileSelection(file);
        }
      }
    },
  };

  const resetFileInput = () => {
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = '';
    }
  };

  const onFileSelection = (file: File) => {
    setIsDragging(false);
    setFileName(file.name);
    setSelectedFile(file);
  };

  const onFileChange = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    const file = fileList[0];
    if (validatorFileSize(file)) {
      onFileSelection(file);
    }
  };

  const resetCSVFile = () => {
    setFileName('');
    setSelectedFile(null);
    resetFileInput();
  };

  const resetDialog = (isClose = true) => {
    resetCSVFile();
    setDelimiter(EnrichmentDelimiterEnum.comma);
    setHasHeader(true);
    setIsDragging(false);
    isClose && close();
  };

  const onClickToCreate = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append(
      'request',
      new Blob([JSON.stringify({ delimiter, hasHeader })], {
        type: 'application/json',
      }),
    );

    setCreating(true);
    try {
      const { data } = await _createEnrichmentTableViaCsv(formData);
      router.push(`/enrichment/${data}`);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ header, message, variant });
    } finally {
      setCreating(false);
      resetDialog(false);
    }
  };

  return (
    <Stack gap={1} height={'100%'} width={'100%'}>
      <EnrichmentHeader dispatch={dispatch} openDialog={open} store={store} />
      <EnrichmentList openDialog={open} store={store} />

      <StyledDialog
        content={
          <Stack py={3}>
            <Stack
              {...dragEvents}
              alignItems={'center'}
              bgcolor={'#F4F5F9'}
              border={'2px dashed #D2D6E1'}
              borderRadius={2}
              display={!selectedFile ? 'flex' : 'none'}
              justifyContent={'center'}
              minHeight={400}
              onClick={() => {
                fileInputRef.current?.click();
                setIsDragging(true);
              }}
              sx={{
                cursor: 'pointer',
                transition: 'all .3s',
                ...(isDragging && {
                  border: '2px dashed #7E6DC5',
                }),
                '&:hover': {
                  border: '2px dashed #7E6DC5',
                },
              }}
              width={'100%'}
            >
              <input
                accept={'.csv,text/csv'}
                hidden
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onFileChange(e.target.files);
                }}
                ref={fileInputRef}
                type="file"
              />

              <Icon component={ICON_UPLOAD} sx={{ width: 24, height: 24 }} />

              <Typography mt={1} variant={'body2'}>
                Drop files here or click to browse
              </Typography>

              <Typography variant={'body2'}>
                Supports .xlsx and .csv formats
              </Typography>
            </Stack>
            <Stack display={!selectedFile ? 'none' : 'flex'} gap={3}>
              <Stack
                alignItems={'center'}
                bgcolor={'#F4F5F9'}
                border={'1px dashed #D2D6E1'}
                borderRadius={2}
                flexDirection={'row'}
                gap={0.5}
                p={3}
              >
                <Icon
                  component={ICON_CSV}
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Typography
                  color={'#6E4EFB'}
                  flex={1}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fileName}
                </Typography>
                <Icon
                  component={ICON_CLOSE}
                  onClick={() => {
                    resetCSVFile();
                  }}
                  sx={{
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    ml: 'auto',
                  }}
                />
              </Stack>

              <Stack gap={1}>
                <Typography fontWeight={600}>Delimiter</Typography>
                <StyledCustomButtonGroup
                  onChange={(value) => setDelimiter(value)}
                  options={ENRICHMENT_CSV_TYPE_OPTIONS}
                  value={delimiter}
                />
              </Stack>

              <StyledCheckbox
                checked={hasHeader}
                label={'First row contains column names'}
                onChange={(e, checked) => setHasHeader(checked)}
              />

              <Stack gap={1.5} mt={-1}>
                <Typography fontWeight={600}>Type of creation</Typography>
                <Stack flexDirection={'row'} gap={1}>
                  <Stack
                    sx={{
                      borderRadius: 2,
                      p: 1.5,
                      flexDirection: 'row',
                      cursor: 'pointer',
                      outline: '1px solid #6E4EFB',
                      border: '1px solid #6E4EFB',
                    }}
                  >
                    <Icon component={ICON_CSV_NEW} />
                    New blank table
                  </Stack>
                  <Stack
                    border={'1px solid #DFDEE6'}
                    borderRadius={2}
                    p={1.5}
                    sx={{
                      borderRadius: 2,
                      p: 1.5,
                      flexDirection: 'row',
                      cursor: 'not-allowed',
                      border: '1px solid #DFDEE6',
                      outline: '1px solid transparent',
                      color: '#B0ADBD',
                    }}
                  >
                    <Icon
                      component={ICON_CSV_EXIST}
                      sx={{
                        '& path': {
                          fill: '#B0ADBD',
                        },
                      }}
                    />
                    Add to existing table
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        }
        footer={
          <StyledButton
            disabled={!selectedFile || !fileName || creating}
            loading={creating}
            onClick={async () => await onClickToCreate()}
            size={'medium'}
          >
            Continue
          </StyledButton>
        }
        header={
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Typography
              color={'inherit'}
              fontSize={'inherit'}
              fontWeight={'inherit'}
            >
              Import from CSV
            </Typography>
            <Icon
              component={ICON_CLOSE}
              onClick={() => resetDialog()}
              sx={{ width: 24, height: 24, cursor: 'pointer' }}
            />
          </Stack>
        }
        onClose={() => resetDialog()}
        open={visible}
        paperWidth={900}
      />
    </Stack>
  );
};

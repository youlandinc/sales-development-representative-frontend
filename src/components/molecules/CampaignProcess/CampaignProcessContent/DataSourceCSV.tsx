import {
  DragEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { debounce, Fade, Icon, Stack, Typography } from '@mui/material';

import { PROSPECT_CSV_TYPE_OPTIONS } from '@/constant';
import { useDialogStore } from '@/stores/useDialogStore';

import {
  SDRToast,
  StyledButton,
  StyledCheckbox,
  StyledLoading,
} from '@/components/atoms';
import { StyledCustomButtonGroup } from '@/components/molecules';
import { StyledPreviewTable } from '../base';

import { _fetchPreviewCSVData, _uploadCSVFile } from '@/request';
import { HttpError, HttpVariantEnum } from '@/types';

import ICON_CSV from '../assets/csv/icon-csv.svg';
import ICON_CLOSE from '../assets/icon-close.svg';

export const DataSourceCSV: FC = () => {
  const globalCSVFormData = useDialogStore((state) => state.csvFormData);
  const setCSVFormData = useDialogStore((state) => state.setCSVFormData);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [localFormData, setLocalFormData] = useState(() => ({
    ...globalCSVFormData,
  }));

  const validatorFileSize = useCallback((files: FileList) => {
    let flag = true;
    Array.from(files).some((item) => {
      if (item.size / 1024 / 1024 > 10) {
        SDRToast({
          header: 'Upload Failed',
          message: 'File size cannot exceed 100MB.',
          variant: HttpVariantEnum.error,
        });
        flag = false;
        return true;
      }
    });
    return flag;
  }, []);

  const stopDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEvents = {
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
      if (uploading) {
        return;
      }
      stopDefaults(e);
      if (fileInputRef.current!.value) {
        fileInputRef.current!.value = '';
      }
      if (e.dataTransfer.files && validatorFileSize(e.dataTransfer.files)) {
        await onFileChange(e.dataTransfer.files);
      }
    },
  };

  const onFileChange = async (fileList: FileList | null) => {
    if (!fileList?.length || uploading) {
      return;
    }

    setIsDragging(false);
    const file = fileList[0];

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const { data } = await _uploadCSVFile(formData);
      setLocalFormData((prev) => ({
        ...prev,
        fileInfo: { ...data },
      }));
      await onFetchPreviewData({
        delimiter: localFormData.delimiter,
        hasHeader: localFormData.hasHeader,
        fileInfo: data,
      });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFetchPreviewData = useCallback(
    async (params: {
      delimiter: typeof localFormData.delimiter;
      hasHeader: boolean;
      fileInfo: typeof localFormData.fileInfo;
    }) => {
      const postData = {
        fileInfo: {
          url: params.fileInfo.url,
          fileName: params.fileInfo.fileName,
          originalFileName: params.fileInfo.originalFileName,
        },
        hasHeader: params.hasHeader,
        delimiter: params.delimiter,
      };
      setFetching(true);
      try {
        const { data } = await _fetchPreviewCSVData(postData);
        setLocalFormData((prev) => ({
          ...prev,
          counts: data.counts,
          validCounts: data.validCounts,
          invalidCounts: data.invalidCounts,
          data: data.data,
        }));
        setCSVFormData(data);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setFetching(false);
      }
    },
    [],
  );

  const debouncedFetchPreviewData = useMemo(
    () => debounce(onFetchPreviewData, 500),
    [onFetchPreviewData],
  );

  useEffect(() => {
    const fileInput = fileInputRef.current;

    const handleCancel = () => {
      setIsDragging(false);
    };

    if (fileInput) {
      fileInput.addEventListener('cancel', handleCancel);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener('cancel', handleCancel);
      }
      debouncedFetchPreviewData.clear();
    };
  }, [debouncedFetchPreviewData]);

  const onClickToReUpload = () => {
    if (uploading) {
      return;
    }
    setLocalFormData((prev) => ({
      ...prev,
      fileInfo: {
        url: '',
        originalFileName: '',
        fileName: '',
      },
      counts: 0,
      validCounts: 0,
      invalidCounts: 0,
      data: [],
    }));
  };

  return (
    <>
      <Fade in={!!localFormData.fileInfo.originalFileName}>
        <Stack
          display={localFormData.fileInfo.originalFileName ? 'flex' : 'none'}
          gap={3}
          overflow={'auto'}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            bgcolor={'#F8F8FA'}
            border={'1px dashed #D2D6E1'}
            borderRadius={2}
            flexDirection={'row'}
            gap={1}
            p={3}
          >
            <Icon component={ICON_CSV} />
            <Typography
              color={'#6E4EFB'}
              sx={{ transition: 'color .3s' }}
              variant={'body2'}
            >
              {localFormData.fileInfo.originalFileName}
            </Typography>

            <Icon
              component={ICON_CLOSE}
              onClick={() => onClickToReUpload()}
              sx={{
                ml: 'auto',
                width: 20,
                height: 20,
                cursor: 'pointer',
              }}
            />
          </Stack>
          <Stack gap={1} pl={0.25}>
            <Typography fontWeight={600}>Delimiter</Typography>
            <StyledCustomButtonGroup
              onChange={(value) => {
                setLocalFormData((prev) => ({ ...prev, delimiter: value }));
                debouncedFetchPreviewData({
                  delimiter: value,
                  hasHeader: localFormData.hasHeader,
                  fileInfo: localFormData.fileInfo,
                });
              }}
              options={PROSPECT_CSV_TYPE_OPTIONS}
              value={localFormData.delimiter}
            />
          </Stack>

          <StyledCheckbox
            checked={localFormData.hasHeader}
            label={'First row contains column names'}
            onChange={(e, checked) => {
              setLocalFormData((prev) => ({ ...prev, hasHeader: checked }));
            }}
            sx={{ width: 'fit-content', userSelect: 'none' }}
          />

          <StyledPreviewTable
            counts={localFormData.counts}
            data={localFormData.data || []}
            fetching={fetching}
            hasHeader={localFormData.hasHeader}
            invalidCounts={localFormData.invalidCounts}
            showSummary={true}
            validCounts={localFormData.validCounts}
          />
        </Stack>
      </Fade>
      <Fade in={!localFormData.fileInfo.originalFileName}>
        <Stack
          alignItems={'center'}
          bgcolor={'#F8F8FA'}
          border={'2px dashed #D2D6E1'}
          borderRadius={2}
          display={!localFormData.fileInfo.originalFileName ? 'flex' : 'none'}
          justifyContent={'center'}
          {...dragEvents}
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
          }}
          width={'100%'}
        >
          <input
            accept={'.csv,text/csv'}
            hidden
            onChange={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              await onFileChange(e.target.files);
            }}
            ref={fileInputRef}
            type="file"
          />
          {uploading ? (
            <>
              <StyledLoading size={32} sx={{ color: '#6E4EFB' }} />
              <Typography color={'text.secondary'} fontSize={14} mt={1}>
                Analyzing your file to find valid email addresses. This may take
                a few moments.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant={'body2'}>
                To ensure accurate data import, make sure the file includes the
                following required fields:
              </Typography>
              <Typography variant={'subtitle2'}>Email address.</Typography>

              <StyledButton size={'medium'} sx={{ width: 88, mt: 6 }}>
                Select file
              </StyledButton>

              <Typography mt={1} variant={'body2'}>
                Drag & drop your file here or click “Select file” to browse
              </Typography>

              <Typography variant={'body2'}>
                Supports .xlsx and .csv formats
              </Typography>
            </>
          )}
        </Stack>
      </Fade>
    </>
  );
};

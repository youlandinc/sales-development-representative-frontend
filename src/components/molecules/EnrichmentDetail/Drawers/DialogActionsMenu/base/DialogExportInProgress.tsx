import { CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';

import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';

import { useAsyncFn } from '@/hooks';

import { _exportTableDataAsCsv } from '@/request';
import { HttpError } from '@/types';

import { createFile } from '@/utils/UnknowHandler';

import { DrawersIconConfig } from '../../DrawersIconConfig';

interface DialogExportInProgressProps {
  open: boolean;
  onClose: () => void;
  tableId: string;
}

export const DialogExportInProgress: FC<DialogExportInProgressProps> = ({
  open,
  onClose,
  tableId,
}) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('export.csv');
  const [downloading, setDownloading] = useState(false);

  const onClickToClose = () => {
    onClose();
  };

  const [, downloadCsv] = useAsyncFn(async () => {
    try {
      const res = await _exportTableDataAsCsv(tableId);
      const disposition = res.headers['content-disposition'] || '';
      const parsedName = disposition.split('filename=')[1] || 'export.csv';
      const blob = new Blob([res.data], {
        type: 'text/csv;charset=UTF-8',
      });
      setFileBlob(blob);
      setFileName(parsedName);
      setStatus('success');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      setStatus('error');
    }
  }, [tableId]);

  useEffect(() => {
    if (open) {
      setStatus('loading');
      void downloadCsv();
      setDownloading(false);
    }
  }, [open, downloadCsv]);

  const headerIcon = useMemo(() => {
    if (status === 'success') {
      return <DrawersIconConfig.ActionMenuSuccess size={20} />;
    }
    if (status === 'error') {
      return <DrawersIconConfig.ActionMenuWarningTriangle size={20} />;
    }
    return (
      <CircularProgress
        size={20}
        sx={{
          color: '#B3B1C2',
        }}
        thickness={4}
      />
    );
  }, [status]);

  const headerText = useMemo(() => {
    if (status === 'success') {
      return 'Export completed';
    }
    if (status === 'error') {
      return 'Export failed';
    }
    return 'Export in progress';
  }, [status]);

  return (
    <StyledDialog
      content={
        <Stack gap={1} pb={2}>
          <Typography color={'#6F6C7D'} variant={'body2'}>
            Your file is being generated. The download will start automatically
            once it&apos;s ready.
          </Typography>
          <Typography color={'#6F6C7D'} variant={'body2'}>
            You can also find it later under Actions → Exports.
          </Typography>
        </Stack>
      }
      contentSx={{
        pt: 0,
      }}
      footer={
        <Stack gap={1.5} width={'100%'}>
          <Divider sx={{ borderColor: 'rgb(223, 222, 230)' }} />
          <StyledButton
            disabled={status === 'loading' || !fileBlob}
            fullWidth
            loading={downloading}
            onClick={async () => {
              if (fileBlob) {
                setDownloading(true);
                try {
                  await Promise.resolve().then(() =>
                    createFile(fileBlob, fileName || 'export.csv'),
                  );
                  onClickToClose();
                } finally {
                  setDownloading(false);
                }
              }
            }}
            size={'medium'}
            sx={{
              bgcolor: '#363440',
              color: 'white',
              '&:hover': {
                bgcolor: '#2D2B36',
              },
            }}
            variant={'contained'}
          >
            Got it
          </StyledButton>
        </Stack>
      }
      header={
        <Stack
          alignItems={'center'}
          direction={'row'}
          gap={1}
          justifyContent={'center'}
        >
          {headerIcon}
          <Typography color={'#363440'} fontSize={16} fontWeight={600}>
            {headerText}
          </Typography>
        </Stack>
      }
      headerSx={{
        pb: 2,
      }}
      onClose={onClose}
      open={open}
      paperWidth={420}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'hidden',
        },
      }}
    />
  );
};

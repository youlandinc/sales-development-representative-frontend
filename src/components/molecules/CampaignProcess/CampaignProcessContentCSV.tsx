import React from 'react';
import { DragEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledButton } from '@/components/atoms';

import { _fetchCsvLeads } from '@/request';
import { HttpError, HttpVariantEnum } from '@/types';

import ICON_XLSX from './assets/icon_xlsx.svg';
import ICON_TRASH from './assets/icon_trash.svg';

import ICON_CHAT_LOGO from './assets/icon_chat_logo.svg';
import ICON_CHAT_THINKING from './assets/icon_chat_thinking.svg';

import ICON_CHAT_PLAN from './assets/icon_chat_plan.svg';
import ICON_EARTH from './assets/icon_earth.svg';
import ICON_LINKEDIN from './assets/icon_linkedin.svg';

import ICON_CHAT_SEARCH from './assets/icon_chat_search.svg';
import ICON_CHAT_COMPLETED from './assets/icon_chat_completed.svg';

const FAKE_ANIMATE = [
  <Stack flexDirection={'row'} gap={1}>
    <Stack alignItems={'center'} width={20}>
      <Icon component={ICON_CHAT_THINKING} />
      <Stack bgcolor={'#D0CEDA'} flex={1} minHeight={24} mt={1} width={'1px'} />
    </Stack>

    <Stack gap={1.5}>
      <Typography>Thinking:</Typography>
      <Typography>
        We’re reading your CSV to detect user details—such as names and email
        addresses—then applying advanced enrichment to create more comprehensive
        profiles. By having deeper insights into your audience, you’ll be able
        to personalize your outreach for higher engagement and improved success
        rates.
      </Typography>
    </Stack>
  </Stack>,
  <Stack flexDirection={'row'} gap={1}>
    <Stack alignItems={'center'} width={20}>
      <Icon component={ICON_CHAT_PLAN} />
      <Stack bgcolor={'#D0CEDA'} flex={1} minHeight={24} mt={1} width={'1px'} />
    </Stack>
    <Typography>Creating a plan</Typography>
  </Stack>,
  <Stack flexDirection={'row'} gap={1}>
    <Stack alignItems={'center'} width={20}>
      <Icon component={ICON_CHAT_SEARCH} />
      <Stack bgcolor={'#D0CEDA'} flex={1} minHeight={24} mt={1} width={'1px'} />
    </Stack>

    <Stack gap={1.5}>
      <Typography>Spinning up researchers</Typography>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_LINKEDIN} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Searching Linkedin</Typography>
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_EARTH} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Doing deep internet research</Typography>
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_EARTH} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Searching Rocketreach</Typography>
      </Stack>
    </Stack>
  </Stack>,
  <Stack flexDirection={'row'} gap={1}>
    <Icon component={ICON_CHAT_COMPLETED} />
    <Typography>Finalizing your results</Typography>
  </Stack>,
];

export const CampaignProcessContentCSV: FC = () => {
  const {
    setLeadsList,
    setLeadsVisible,
    setLeadsCount,
    setIsFirst,
    setCSVFormData,
    csvFormData,
    setLeadsFetchLoading,
  } = useDialogStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(csvFormData.originalFileName || '');
  const [mode, setMode] = useState<'default' | 'animating' | 'complete'>(
    csvFormData.url ? 'complete' : 'default',
  );

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
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    setIsFirst(false);
    setLeadsVisible(true);
    setMode('animating');
    setUploading(true);
    setLeadsFetchLoading(true);

    try {
      const {
        data: { counts, leads, fileInfo },
      } = await _fetchCsvLeads(formData);
      setLeadsCount(counts);
      setLeadsList(leads);
      setCSVFormData(fileInfo);
      setMode('complete');
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setUploading(false);
      setLeadsFetchLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
    };
  }, []);

  const timerRef = useRef<any>(null);
  const [animateIndex, setAnimateIndex] = useState(0);
  const [animateList, setAnimateList] = useState<any[]>([]);

  useEffect(() => {
    if (mode !== 'default') {
      if (!uploading && mode === 'complete') {
        setAnimateIndex(FAKE_ANIMATE.length - 1);
        clearInterval(timerRef.current);
        setAnimateList([
          ...FAKE_ANIMATE.slice(0, -1),
          <Stack flexDirection={'row'} gap={1}>
            <Icon component={ICON_CHAT_COMPLETED} />
            <Typography>
              Based on the CSV you provided, a total of 100 records were found.
            </Typography>
          </Stack>,
        ]);
        return;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mode === 'complete') {
        return;
      }
      if (animateIndex === FAKE_ANIMATE.length) {
        setMode('complete');
        return;
      }
      timerRef.current = setInterval(() => {
        setAnimateList((prev) => [...prev, FAKE_ANIMATE[animateIndex]]);
        setAnimateIndex((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [animateIndex, mode, uploading]);

  const onClickToReUpload = () => {
    if (uploading) {
      return;
    }
    setMode('default');
    setAnimateList([]);
    setAnimateIndex(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFileName('');
    setUploading(false);
  };

  return (
    <>
      <Fade in={['animating', 'complete'].includes(mode)}>
        <Stack
          display={mode === 'default' ? 'none' : 'flex'}
          gap={3}
          overflow={'auto'}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            bgcolor={'rgba(91, 118, 188, 0.10)'}
            borderRadius={'10px 0px 10px 10px'}
            flexDirection={'row'}
            flexShrink={0}
            gap={1}
            ml={'auto'}
            onClick={() => onClickToReUpload()}
            px={2}
            py={1}
            sx={{
              cursor: 'pointer',
            }}
            width={'fit-content'}
          >
            <Icon component={ICON_XLSX} />
            <Typography
              color={uploading ? '#B0ADBD' : 'text.secondary'}
              sx={{ transition: 'color .3s' }}
              variant={'body2'}
            >
              {fileName || 'California Inc. - 123412.csv'}
            </Typography>

            <Icon
              component={ICON_TRASH}
              sx={{
                width: 20,
                height: 20,
                '& > path': {
                  fill: uploading ? '#B0ADBD' : '#6F6C7D',
                },
              }}
            />
          </Stack>

          <Stack width={'100%'}>
            <Stack flexDirection={'row'} gap={1}>
              <Icon
                component={ICON_CHAT_LOGO}
                sx={{ width: 32, height: 32, flexShrink: 0 }}
              />
              <Stack
                gap={3}
                sx={{
                  '& > *': {
                    fontSize: 14,
                    color: 'text.secondary',
                  },
                }}
              >
                {animateList.map((item, index) => (
                  <Fade in={true} key={`fake-animate-${index}}`}>
                    {item}
                  </Fade>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Fade>
      <Fade in={mode === 'default'}>
        <Stack
          alignItems={'center'}
          bgcolor={'#F7F4FD'}
          border={'2px dashed #D2D6E1'}
          borderRadius={2}
          display={['animating', 'complete'].includes(mode) ? 'none' : 'flex'}
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
            hidden
            onChange={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              await onFileChange(e.target.files);
            }}
            ref={fileInputRef}
            type="file"
          />
          <Typography variant={'body2'}>
            To ensure accurate data import, make sure the file includes the
            following required fields:
          </Typography>
          <Typography variant={'subtitle2'}>
            Full Name, Last Name, First Name, and Email.
          </Typography>

          <StyledButton size={'medium'} sx={{ width: 88, mt: 6 }}>
            Select file
          </StyledButton>

          <Typography mt={1} variant={'body2'}>
            Drag & drop your file here or click “Select file” to browse
          </Typography>

          <Typography variant={'body2'}>
            Supports .xlsx and .csv formats
          </Typography>
        </Stack>
      </Fade>
    </>
  );
};

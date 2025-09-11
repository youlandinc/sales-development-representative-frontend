import { ChangeEvent, FC, useRef, useState } from 'react';
import { Avatar, Fade, Icon, Skeleton, Stack, Typography } from '@mui/material';
import { useBreakpoints, useSwitch } from '@/hooks';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import Image from 'next/image';
import 'react-advanced-cropper/dist/style.css';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import { HttpError, HttpVariantEnum } from '@/types';

//import ICON_DELETE from './assets/icon_delete.svg';
import ICON_UPLOAD from './assets/icon_upload.svg';

import { UGetRoundedCanvas } from '@/utils';
import {
  _commonUpload,
  _fetchSettingsInfo,
  _updateSettingsInfo,
} from '@/request';
import useSWR from 'swr';
import { useUserStore } from '@/providers';

const INITIAL_STATE = {
  avatar: '',
  name: '',
};

export const SettingsEmailProfile: FC = () => {
  const breakpoints = useBreakpoints();
  const { userProfile } = useUserStore((state) => state);

  const {
    open: openForm,
    visible: visibleForm,
    close: closeForm,
  } = useSwitch();
  const {
    open: openClip,
    visible: visibleClip,
    close: closeClip,
  } = useSwitch();

  const { isLoading, mutate } = useSWR(
    userProfile?.tenantId ? userProfile.tenantId : null,
    async (tenantId: string) => {
      try {
        const {
          data: { avatar, name },
        } = await _fetchSettingsInfo(tenantId);
        setProfileInfo({
          avatar: avatar ?? '',
          name: name ?? '',
        });
        setClipSrc(avatar);
        setProfileName(name);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [profileInfo, setProfileInfo] = useState(INITIAL_STATE);
  const [profileName, setProfileName] = useState('');

  const [maskVisible, setMaskVisible] = useState(false);

  const [imageSrc, setImageSrc] = useState('');
  const [clipSrc, setClipSrc] = useState('');
  const [imageName, setImageName] = useState('');

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const onClickToUpdateForm = async () => {
    if (!profileName || updating) {
      return;
    }
    setUpdating(true);
    try {
      await _updateSettingsInfo({
        tenantId: userProfile.tenantId,
        name: profileName,
        avatar: clipSrc.split('?')[0],
      });
      SDRToast({
        header: 'Profile updated successfully',
        variant: HttpVariantEnum.success,
        message: '',
      });
      onClickToCloseForm();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setUpdating(false);
    }
  };

  const onClickToOpenForm = () => {
    openForm();
    setImageSrc(profileInfo.avatar);
    setClipSrc(profileInfo.avatar);
    setProfileName(profileInfo.name);
  };

  const onClickToCloseForm = () => {
    closeForm();
    setClipSrc('');
    setProfileName('');
  };

  const onClickToCloseClip = () => {
    closeClip();
    setImageSrc('');
    setImageName('');
  };

  const uploadAvatar = async (formData: FormData) => {
    setUploading(true);
    try {
      const { data } = await _commonUpload(formData);
      const url = data[0]?.url;
      setClipSrc(url);
      onClickToCloseClip();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setUploading(false);
    }
  };

  const onClickToConfirmClip = async () => {
    if (!cropperRef.current) {
      return;
    }
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) {
      return;
    }
    UGetRoundedCanvas(canvas, 120, 120).toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('files', blob as File, imageName);
      await uploadAvatar(formData);
    });
  };

  const onClickToUploadFile = () => {
    if (inputRef.current!.value) {
      inputRef.current!.value = '';
    }
    inputRef.current!.click();
  };

  const onFormFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!e.target.files?.[0]) {
      return;
    }
    const file = e.target.files?.[0];
    if (file.size > 1024 * 1024 * 10) {
      SDRToast({
        variant: HttpVariantEnum.warning,
        header: 'File size is too large',
        message: '',
      });
      return;
    }
    setImageName(file.name);
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    let blob = new Blob(undefined);
    reader.onload = (e1) => {
      const result = e1.target?.result as ArrayBuffer;
      if (typeof result === 'object') {
        blob = new Blob([result]);
      } else {
        blob = result;
      }
      const readerImg = new FileReader();
      readerImg.readAsDataURL(blob);
      setImageSrc(url);
      openClip();
    };
  };

  return (
    <>
      <Stack gap={2}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          maxWidth={900}
        >
          <Typography>Name and profile</Typography>
          <StyledButton
            color={'info'}
            disabled={isLoading}
            onClick={() => onClickToOpenForm()}
            size={'small'}
            sx={{ py: '6px !important' }}
            variant={'outlined'}
          >
            Edit email profile
          </StyledButton>
        </Stack>

        <Stack
          alignItems={'center'}
          borderRadius={2}
          flexDirection={'row'}
          p={1.5}
          sx={{
            border: '1px solid',
            borderColor: 'border.default',
            '&:hover': {
              borderColor: 'border.active',
            },
          }}
          width={438}
        >
          {isLoading ? (
            <>
              <Skeleton height={40} variant={'circular'} width={40} />
              <Skeleton
                height={20}
                sx={{ ml: 2 }}
                variant={'rounded'}
                width={180}
              />
            </>
          ) : (
            <>
              <Avatar
                src={profileInfo.avatar || '/images/placeholder_avatar.png'}
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 600,
                  border: '1px solid #DFDEE6',
                }}
              >
                {profileInfo?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography ml={2} variant={'subtitle2'}>
                {profileInfo?.name}
              </Typography>
            </>
          )}

          {/*<Icon*/}
          {/*  component={ICON_DELETE}*/}
          {/*  sx={{ ml: 'auto', width: 20, height: 20, cursor: 'pointer' }}*/}
          {/*/>*/}
        </Stack>
      </Stack>

      <StyledDialog
        content={
          <Stack gap={3} py={3}>
            <Typography variant={'subtitle1'}>Profile</Typography>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={{ xs: 2, md: 3 }}
            >
              <input
                accept={'image/*'}
                hidden
                onChange={(e) => onFormFileChange(e)}
                ref={inputRef}
                type="file"
              />

              <Stack
                borderRadius={'50%'}
                height={{ xs: 80, lg: 120 }}
                onClick={() => onClickToUploadFile()}
                onMouseEnter={() => setMaskVisible(true)}
                onMouseLeave={() => setMaskVisible(false)}
                position={'relative'}
                width={{ xs: 80, lg: 120 }}
              >
                <Avatar
                  src={clipSrc || '/images/placeholder_avatar.png'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: { xs: 18, lg: 36 },
                    border: '1px solid #DFDEE6',
                  }}
                >
                  {profileInfo?.name.charAt(0).toUpperCase()}
                </Avatar>

                <Image
                  alt={'camera'}
                  height={['xs', 'sm', 'md'].includes(breakpoints) ? 20 : 30}
                  loading={'eager'}
                  src="/images/icon_camera.png"
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  width={['xs', 'sm', 'md'].includes(breakpoints) ? 20 : 30}
                />

                <Stack
                  alignItems={'center'}
                  bgcolor={'rgba(0,0,0,.2)'}
                  borderRadius={'50%'}
                  height={'100%'}
                  justifyContent={'center'}
                  position={'absolute'}
                  sx={{ cursor: 'pointer', top: 0, left: 0 }}
                  width={'100%'}
                  zIndex={maskVisible ? 99 : -1}
                >
                  {maskVisible && (
                    <Icon
                      component={ICON_UPLOAD}
                      sx={{ width: 20, height: 20 }}
                    />
                  )}
                </Stack>
              </Stack>

              <Stack gap={{ xs: 0.75, md: 1.5 }}>
                <Typography color={'text.secondary'} fontSize={12}>
                  JPEG (.jpeg, .jpg) and PNG (.png) formats accepted, up to 3
                  MB.
                </Typography>

                <Fade
                  in={!!clipSrc}
                  style={{
                    display: !clipSrc ? 'none' : 'block',
                  }}
                  timeout={300}
                >
                  <Typography
                    color={'#5B76BC'}
                    fontSize={12}
                    onClick={() => {
                      setClipSrc('');
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Remove picture
                  </Typography>
                </Fade>
              </Stack>
            </Stack>

            <Stack gap={1.5}>
              <Typography variant={'subtitle1'}>Name</Typography>
              <StyledTextField
                label={'Profile name'}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={'Profile name'}
                value={profileName}
              />
            </Stack>
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              onClick={() => onClickToCloseForm()}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={updating || !profileName}
              loading={updating}
              onClick={() => onClickToUpdateForm()}
              size={'medium'}
              sx={{ width: 66 }}
            >
              Save
            </StyledButton>
          </Stack>
        }
        header={'Edit profile'}
        onClose={() => {
          onClickToCloseForm();
        }}
        open={visibleForm}
        paperWidth={800}
      />

      <StyledDialog
        content={
          <Stack pb={3}>
            <Cropper className={'cropper'} ref={cropperRef} src={imageSrc} />
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              disabled={uploading}
              onClick={() => onClickToCloseClip()}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={uploading}
              loading={uploading}
              onClick={() => onClickToConfirmClip()}
              size={'medium'}
              sx={{ width: 136 }}
            >
              Save & confirm
            </StyledButton>
          </Stack>
        }
        header={''}
        onClose={() => onClickToCloseClip()}
        open={visibleClip}
      />
    </>
  );
};

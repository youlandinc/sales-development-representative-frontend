import { FC, useEffect, useMemo, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import { useUserStore } from '@/providers';
import { _modifyUserInfo, _userResetPassword } from '@/request';

import GOOGLE_ICON from './assets/icon_google.svg';
import EMAIL_ICON from './assets/icon_email.svg';
import { HttpVariantEnum } from '@/types';

export const SettingsPersonalInfo: FC = () => {
  const { userProfile, setUserProfile } = useUserStore((state) => state);
  const { loginType, email, firstName, lastName } = userProfile;

  const [firstNameText, setFirstNameText] = useState('');
  const [lastNameText, setLastNameText] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  useEffect(() => {
    setFirstNameText(firstName);
    setLastNameText(lastName);
  }, [firstName, lastName]);

  const isDisabled = useMemo(() => {
    return firstNameText === firstName && lastNameText === lastName && !loading;
  }, [firstNameText, lastNameText, firstName, lastName, loading]);

  const handleSaveChanges = async () => {
    if (isDisabled) {
      return;
    }
    setLoading(true);
    try {
      const {
        data: { userProfile },
      } = await _modifyUserInfo({
        firstName: firstNameText,
        lastName: lastNameText,
      });
      setUserProfile(userProfile);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      return;
    }

    setResetPasswordLoading(true);
    try {
      const { data } = await _userResetPassword({
        email,
      });
      if (data) {
        SDRToast({
          message:
            "We've sent you password reset instructions to your email. If you don't receive the email, please try again.",
          header: '',
          variant: HttpVariantEnum.success,
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <Stack gap={3}>
      <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={3} p={3}>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          maxWidth={900}
        >
          <Stack gap={0.5}>
            <Typography
              color={'#363440'}
              component={'div'}
              fontSize={18}
              lineHeight={1.2}
              variant={'h6'}
            >
              Account
            </Typography>
            <Typography
              color={'#6F6C7D'}
              component={'div'}
              fontSize={14}
              fontWeight={400}
              lineHeight={1.5}
              variant={'h6'}
            >
              Your personal information and account security settings.
            </Typography>
          </Stack>
          <StyledButton
            disabled={isDisabled}
            loading={loading}
            onClick={handleSaveChanges}
            size={'small'}
            sx={{
              width: '104px',
            }}
            variant={'contained'}
          >
            Save changes
          </StyledButton>
        </Stack>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} gap={3} maxWidth={900}>
            {loginType === 'GOOGLE_LOGIN' ? (
              <Stack flex={1} gap={'4px'}>
                <Typography
                  color={'#202939'}
                  fontSize={14}
                  fontWeight={400}
                  lineHeight={1.5}
                  variant={'body2'}
                >
                  Login type
                </Typography>
                <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                  <Icon
                    component={GOOGLE_ICON}
                    sx={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <Typography
                    color={'#6F6C7D'}
                    fontSize={14}
                    fontWeight={400}
                    lineHeight={1.5}
                    variant={'body2'}
                  >
                    Google
                  </Typography>
                </Stack>
              </Stack>
            ) : null}
            <Stack flex={1} gap={'4px'}>
              <Typography
                color={'#202939'}
                fontSize={14}
                fontWeight={400}
                lineHeight={1.5}
                variant={'body2'}
              >
                Email
              </Typography>
              <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                <Icon
                  component={EMAIL_ICON}
                  sx={{
                    width: '20px',
                    height: '20px',
                  }}
                />
                <Typography
                  color={'#6F6C7D'}
                  fontSize={14}
                  fontWeight={400}
                  lineHeight={1.5}
                  variant={'body2'}
                >
                  {email || '-'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} gap={3} maxWidth={900}>
            <Stack flex={1} gap={'4px'}>
              <Typography
                color={'#202939'}
                fontSize={14}
                fontWeight={400}
                lineHeight={1.5}
                variant={'body2'}
              >
                First name
              </Typography>
              <StyledTextField
                label={'First name'}
                onChange={(e) => setFirstNameText(e.target.value.trim())}
                value={firstNameText}
              />
            </Stack>
            <Stack flex={1} gap={'4px'}>
              <Typography
                color={'#202939'}
                fontSize={14}
                fontWeight={400}
                lineHeight={1.5}
                variant={'body2'}
              >
                Last name
              </Typography>
              <StyledTextField
                label={'Last name'}
                onChange={(e) => setLastNameText(e.target.value.trim())}
                value={lastNameText}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={3} p={3}>
        <Stack
          flexDirection={'row'}
          gap={3}
          justifyContent={'space-between'}
          maxWidth={900}
        >
          <Stack gap={0.5}>
            <Typography
              color={'#363440'}
              component={'div'}
              fontSize={18}
              lineHeight={1.2}
              variant={'h6'}
            >
              Password
            </Typography>
            <Typography
              color={'#6F6C7D'}
              component={'div'}
              fontSize={14}
              fontWeight={400}
              lineHeight={1.5}
              variant={'h6'}
            >
              If you request a password reset, we’ll email you instructions to
              create a new one. For security, you may be signed out of other
              devices once your password is updated.
            </Typography>
          </Stack>
          <StyledButton
            loading={resetPasswordLoading}
            onClick={handleResetPassword}
            size={'small'}
            sx={{
              borderColor: '#DFDEE6 !important',
              color: '#1E1645 !important',
              width: '115px',
            }}
            variant={'outlined'}
          >
            Reset password
          </StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

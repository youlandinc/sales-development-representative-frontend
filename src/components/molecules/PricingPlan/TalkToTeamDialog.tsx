import { Box, Icon, Link, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledNumberFormat,
  StyledTextField,
} from '@/components/atoms';
import { StyledFormElementContainer } from './base';

import { PrivacyPolicy, TermsOfUse } from '@/constants';
import { PlanTypeEnum } from '@/types';
import { PaymentTypeEnum, SendPricingEmailParam } from '@/types/pricingPlan';
import { useAsyncFn } from '@/hooks';
import { _sendPricingEmail } from '@/request/pricingPlan';

import { Close } from '@mui/icons-material';
import ICON_CONFETTI from './assets/icon_confetti.svg';
export interface TalkToTeamDialogProps {
  open: boolean;
  onClose: () => void;
  planType: PlanTypeEnum;
  pricingType: PaymentTypeEnum;
}

export type TalkToTeamFormData = Omit<
  SendPricingEmailParam,
  'planType' | 'pricingType'
>;

export const TalkToTeamDialog: FC<TalkToTeamDialogProps> = ({
  open,
  onClose,
  planType,
  pricingType,
}) => {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<TalkToTeamFormData>({
    firstName: '',
    lastName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    position: '',
    useCase: '',
  });

  const [state, sendEmail] = useAsyncFn(async () => {
    try {
      await _sendPricingEmail({
        ...formData,
        planType,
        pricingType: pricingType || null,
      });
      setIsSubmitted(true);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [formData, planType, pricingType]);

  const handleChange =
    (field: keyof TalkToTeamFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    await sendEmail();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      firstName: '',
      lastName: '',
      workEmail: '',
      phone: '',
      companyName: '',
      position: '',
      useCase: '',
    });
    setIsSubmitted(false);
  };

  const handleGoToDirectories = () => {
    router.push('/directories');
    handleClose();
  };

  // Success state content
  const successContent = (
    <Stack
      spacing={6}
      sx={{
        pt: 3,
        pb: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      <Stack alignItems="center" spacing={1.5}>
        {/* Confetti Icon */}
        <Icon
          component={ICON_CONFETTI}
          sx={{
            width: 64,
            height: 64,
          }}
        />

        {/* Thank you message */}
        <Typography
          sx={{
            lineHeight: 1.4,
          }}
          variant={'body2'}
        >
          Thank you! We&apos;ll reach out soon.
        </Typography>

        {/* Main message */}
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            textAlign: 'center',
            maxWidth: 450,
          }}
        >
          In the meantime, you can start prospecting with Corepass
        </Typography>
      </Stack>

      {/* Go to directories button */}
      <StyledButton
        onClick={handleGoToDirectories}
        size="medium"
        sx={{
          width: 336,
        }}
      >
        Go to Directories
      </StyledButton>
    </Stack>
  );

  // Form content
  const formContent = (
    <Stack spacing={3} sx={{ pt: 3 }}>
      {/* First name and Last name row */}
      <Stack direction="row" spacing={3}>
        <StyledFormElementContainer label="First name">
          <StyledTextField
            onChange={handleChange('firstName')}
            placeholder="Your first name"
            size={'large'}
            value={formData.firstName}
          />
        </StyledFormElementContainer>
        <StyledFormElementContainer label="Last name">
          <StyledTextField
            onChange={handleChange('lastName')}
            placeholder="Your last name"
            size={'large'}
            value={formData.lastName}
          />
        </StyledFormElementContainer>
      </Stack>

      {/* Work email and Phone row */}
      <Stack direction="row" spacing={3}>
        <StyledFormElementContainer label="Work email">
          <StyledTextField
            onChange={handleChange('workEmail')}
            placeholder="name@company.com"
            size={'large'}
            type="email"
            value={formData.workEmail}
          />
        </StyledFormElementContainer>
        <StyledFormElementContainer label="Phone (optional)">
          <StyledNumberFormat
            format="(###) ###-####"
            onValueChange={({ floatValue }) => {
              setFormData((prev) => ({
                ...prev,
                phone: floatValue?.toString() || '',
              }));
            }}
            placeholder="Your phone number"
            size={'large'}
            type="tel"
            value={formData.phone}
          />
        </StyledFormElementContainer>
      </Stack>

      {/* Company and Position row */}
      <Stack direction="row" spacing={3}>
        <StyledFormElementContainer label="Company">
          <StyledTextField
            onChange={handleChange('companyName')}
            placeholder="Your company name"
            size={'large'}
            value={formData.companyName}
          />
        </StyledFormElementContainer>
        <StyledFormElementContainer label="Position">
          <StyledTextField
            onChange={handleChange('position')}
            placeholder="Your job title"
            size={'large'}
            value={formData.position}
          />
        </StyledFormElementContainer>
      </Stack>

      {/* Use case textarea */}
      <StyledFormElementContainer label="What are you looking to do?">
        <StyledTextField
          multiline
          onChange={handleChange('useCase')}
          placeholder="Briefly describe your use case"
          rows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              alignItems: 'flex-start',
              p: 2,
            },
            '& .MuiInputBase-inputMultiline': {
              py: 0,
            },
          }}
          value={formData.useCase}
        />
      </StyledFormElementContainer>

      {/* Submit button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledButton
          disabled={[
            formData.firstName,
            formData.lastName,
            formData.workEmail,
            formData.companyName,
            formData.position,
            formData.useCase,
          ].some((item) => item.trim() === '')}
          loading={state.loading}
          onClick={handleSubmit}
          size="medium"
          sx={{
            width: 336,
          }}
        >
          Submit
        </StyledButton>
      </Box>

      {/* Terms text */}
      <Typography color={'#B0ADBD'} variant={'body3'}>
        By clicking &quot;Submit&quot; or signing up, you agree to
        Corepass&apos;s{' '}
        <Link
          href={TermsOfUse}
          sx={{
            color: '#363440',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          href={PrivacyPolicy}
          sx={{
            color: '#363440',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Privacy Policy
        </Link>
        .
      </Typography>
    </Stack>
  );

  return (
    <StyledDialog
      content={isSubmitted ? successContent : formContent}
      header={
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Talk to our team
          </Typography>
          <Close
            onClick={handleClose}
            sx={{ fontSize: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={handleClose}
      open={open}
      paperWidth={800}
    />
  );
};

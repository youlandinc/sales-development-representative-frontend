import { Box, Link, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import {
  StyledButton,
  StyledDialog,
  StyledNumberFormat,
  StyledTextField,
} from '@/components/atoms';

import CloseIcon from '@mui/icons-material/Close';
import ConfettiIcon from './assets/icon_confetti.svg';

export interface TalkToTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: TalkToTeamFormData) => void;
  onGoToDirectories?: () => void;
}

export interface TalkToTeamFormData {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone?: string;
  company: string;
  position: string;
  useCase: string;
}

export const TalkToTeamDialog: FC<TalkToTeamDialogProps> = ({
  open,
  onClose,
  onSubmit,
  onGoToDirectories,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<TalkToTeamFormData>({
    firstName: '',
    lastName: '',
    workEmail: '',
    phone: '',
    company: '',
    position: '',
    useCase: '',
  });

  const handleChange =
    (field: keyof TalkToTeamFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = () => {
    onSubmit?.(formData);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      workEmail: '',
      phone: '',
      company: '',
      position: '',
      useCase: '',
    });
    setIsSubmitted(false);
    onClose();
  };

  const handleGoToDirectories = () => {
    handleClose();
    onGoToDirectories?.();
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
        <Box
          alt="Success"
          component="img"
          src={ConfettiIcon}
          sx={{
            width: 64,
            height: 64,
          }}
        />

        {/* Thank you message */}
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: 'text.primary',
            lineHeight: 1.4,
          }}
        >
          Thank you! We&apos;ll reach out soon.
        </Typography>

        {/* Main message */}
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.2,
            textAlign: 'center',
            maxWidth: 450,
          }}
        >
          In the meantime, you can start prospecting with Corepass
        </Typography>
      </Stack>

      {/* Go to Directories button */}
      <StyledButton
        onClick={handleGoToDirectories}
        size="medium"
        sx={{
          width: 336,
          height: 40,
          bgcolor: '#363440',
          color: 'white',
          fontSize: 14,
          fontWeight: 400,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            bgcolor: '#4C4957',
          },
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
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            First name
          </Typography>
          <StyledTextField
            onChange={handleChange('firstName')}
            placeholder="Your first name"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            value={formData.firstName}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            Last name
          </Typography>
          <StyledTextField
            onChange={handleChange('lastName')}
            placeholder="Your last name"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            value={formData.lastName}
          />
        </Box>
      </Stack>

      {/* Work email and Phone row */}
      <Stack direction="row" spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            Work email
          </Typography>
          <StyledTextField
            onChange={handleChange('workEmail')}
            placeholder="name@company.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            type="email"
            value={formData.workEmail}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            Phone (optional)
          </Typography>
          <StyledNumberFormat
            format="(###) ###-####"
            onValueChange={({ floatValue }) => {
              setFormData((prev) => ({
                ...prev,
                phone: floatValue?.toString() || '',
              }));
            }}
            placeholder="Your phone number"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            type="tel"
            value={formData.phone}
          />
        </Box>
      </Stack>

      {/* Company and Position row */}
      <Stack direction="row" spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            Company
          </Typography>
          <StyledTextField
            onChange={handleChange('company')}
            placeholder="Your company name"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            value={formData.company}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#202939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            Position
          </Typography>
          <StyledTextField
            onChange={handleChange('position')}
            placeholder="Your job title"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            }}
            value={formData.position}
          />
        </Box>
      </Stack>

      {/* Use case textarea */}
      <Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: '#202939',
            lineHeight: 1.4,
            mb: 0.5,
          }}
        >
          What are you looking to do?
        </Typography>
        <StyledTextField
          multiline
          onChange={handleChange('useCase')}
          placeholder="Briefly describe your use case"
          rows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              // height: 86,
              alignItems: 'flex-start',
              p: 2,
            },
            '& .MuiInputBase-input': {
              height: '100% !important',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#B0ADBD',
              opacity: 1,
            },
            '& .MuiInputBase-inputMultiline': {
              py: 0,
            },
          }}
          value={formData.useCase}
        />
      </Box>

      {/* Submit button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledButton
          disabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.workEmail ||
            !formData.company ||
            !formData.position ||
            !formData.useCase
          }
          onClick={handleSubmit}
          size="medium"
          sx={{
            width: 336,
            height: 40,
            bgcolor: '#363440',
            color: 'white',
            fontSize: 14,
            fontWeight: 400,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#4C4957',
            },
          }}
        >
          Submit
        </StyledButton>
      </Box>

      {/* Terms text */}
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 400,
          color: '#B0ADBD',
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        By clicking &quot;Submit&quot; or signing up, you agree to Corepass's{' '}
        <Link
          href="#"
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
          href="#"
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
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            Talk to our team
          </Typography>
          <CloseIcon
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

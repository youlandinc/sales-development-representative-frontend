import { useMemo } from 'react';
import {
  Divider,
  Icon,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import { EmailDomainData } from '@/types';

import ICON_COPY from '../../assets/icon_email_copy.svg';

const steps = ['Enter email domain', 'Verify ownership', 'Set sender name'];

interface SettingsEmailDomainDialogProps {
  activeStep: number;
  domain: string;
  setDomain: (domain: string) => void;
  domainVerifyList: EmailDomainData[];
  userName: string;
  setUserName: (userName: string) => void;
  stepButtonLoading: boolean;
  visible: boolean;
  isSmall: boolean;
  onCancelDialog: () => void;
  onClickContinue: () => void;
  onClickVerify: (domain: string) => void;
  onClickSave: (domain: string) => void;
  onClickCopy: (type: string, text: string) => void;
}

export const SettingsEmailDomainDialog = ({
  activeStep,
  domain,
  setDomain,
  domainVerifyList,
  userName,
  setUserName,
  stepButtonLoading,
  visible,
  isSmall,
  onCancelDialog,
  onClickContinue,
  onClickVerify,
  onClickSave,
  onClickCopy,
}: SettingsEmailDomainDialogProps) => {
  const smallVerifyList = useMemo(() => {
    return (
      <Stack divider={<Divider />} gap={1.5} mb={3} mt={1.5}>
        {domainVerifyList.map((item, index) => (
          <Stack
            gap={{ xs: 1.5, lg: 3 }}
            key={`mobile_verifyList_${index}_${item.recordName}`}
          >
            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                color={'#202939'}
                flexShrink={0}
                fontSize={12}
                fontWeight={600}
                width={62}
              >
                Type
              </Typography>
              <Typography fontSize={12}>{item.domainType}</Typography>
            </Stack>

            <Stack flexDirection={'row'}>
              <Typography
                color={'#202939'}
                flexShrink={0}
                fontSize={12}
                fontWeight={600}
                width={62}
              >
                Name
              </Typography>
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                flexGrow={1}
                justifyContent={'space-between'}
              >
                <Typography
                  component={'div'}
                  fontSize={12}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {item.recordName}
                </Typography>
                <Icon
                  component={ICON_COPY}
                  onClick={() => onClickCopy('name', item.recordName)}
                  sx={{
                    ml: '12px',
                    width: 20,
                    height: 20,
                  }}
                />
              </Stack>
            </Stack>

            <Stack flexDirection={'row'}>
              <Typography
                color={'#202939'}
                flexShrink={0}
                fontSize={12}
                fontWeight={600}
                width={62}
              >
                Value
              </Typography>
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                flexGrow={1}
                justifyContent={'space-between'}
              >
                <Typography
                  component={'div'}
                  fontSize={12}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {item.recordValue}
                </Typography>
                <Icon
                  component={ICON_COPY}
                  onClick={() => onClickCopy('value', item.recordValue)}
                  sx={{
                    ml: '12px',
                    width: 20,
                    height: 20,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  }, [domainVerifyList, onClickCopy]);

  const largeVerifyList = useMemo(() => {
    return (
      <Stack divider={<Divider />} gap={1.5} mb={3} mt={1.5}>
        <Stack
          color={'#6F6C7D'}
          flexDirection={'row'}
          fontSize={14}
          gap={3}
          lineHeight={'20px'}
        >
          <Stack flex={0.5} flexShrink={0}>
            Type
          </Stack>
          <Stack flex={2.5} flexShrink={0}>
            Name
          </Stack>
          <Stack flex={3} flexShrink={0}>
            Value
          </Stack>
        </Stack>

        {domainVerifyList.map((item, index) => (
          <Stack
            color={'#202939'}
            flexDirection={'row'}
            fontSize={14}
            gap={3}
            key={`pc_verifyList_${index}_${item.recordName}`}
            lineHeight={'20px'}
          >
            <Stack flex={0.5}>{item.domainType}</Stack>
            <Stack
              flex={2.5}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                component={'div'}
                fontSize={14}
                sx={{ wordBreak: 'break-all' }}
              >
                {item.recordName}
              </Typography>
              <Icon
                component={ICON_COPY}
                onClick={() => onClickCopy('name', item.recordName)}
                sx={{
                  ml: '12px',
                  width: 20,
                  height: 20,
                }}
              />
            </Stack>
            <Stack
              flex={3}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                component={'div'}
                fontSize={14}
                sx={{ wordBreak: 'break-all' }}
              >
                {item.recordValue}
              </Typography>
              <Icon
                component={ICON_COPY}
                onClick={() => onClickCopy('value', item.recordValue)}
                sx={{
                  ml: '12px',
                  width: 20,
                  height: 20,
                }}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  }, [domainVerifyList, onClickCopy]);

  const renderStepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Stack>
            <Typography color={'#636A7C'} variant={'body2'}>
              Please enter your custom email domain. For example, if your email
              is admin@example-domain.com, your custom domain is{' '}
              <strong>example-domain.com</strong>.
              <br />
              <strong>Note:</strong> Email domains from providers like Gmail or
              Outlook are <strong>not supported</strong>.
            </Typography>
            <StyledTextField
              label={'Email domain'}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={'e.g. example-domain.com'}
              sx={{
                my: 3,
                '& label': {
                  color: 'text.secondary',
                },
              }}
              value={domain}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack width={'100%'}>
            <Typography
              color={'#6E4EFB'}
              component={'div'}
              fontSize={{ xs: 12, lg: 12 }}
              sx={{
                bgcolor: '#F7F4FD',
                p: 1.5,
                borderRadius: 1,
              }}
            >
              After creating your domain identity with Easy DKIM, you must
              complete the verification process for DKIM authentication by
              copying the CNAME record generated below and publishing it with
              your domain&apos;s DNS provider. Detection of these records may
              take up to 72 hours.
            </Typography>

            {isSmall ? smallVerifyList : largeVerifyList}
          </Stack>
        );
      case 2:
        return (
          <Stack>
            <Typography color={'#636A7C'} variant={'body2'}>
              Please enter the part before “@” in your email address. For
              example, if your email is admin@example-domain.com, enter{' '}
              <strong>admin.</strong>
            </Typography>

            <StyledTextField
              label={'Sender name'}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={'e.g. admin'}
              sx={{
                my: 3,
                '& label': {
                  color: 'text.secondary',
                },
              }}
              value={userName}
            />
          </Stack>
        );
    }
  }, [
    activeStep,
    domain,
    isSmall,
    setDomain,
    setUserName,
    userName,
    smallVerifyList,
    largeVerifyList,
  ]);

  const renderStepButton = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <StyledButton
            disabled={stepButtonLoading || !domain}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={onClickContinue}
            size={'small'}
            sx={{
              width: '84px',
              height: '40px !important',
              backgroundColor: '#6E4EFB',
            }}
            variant={'contained'}
          >
            Continue
          </StyledButton>
        );
      case 1:
        return (
          <StyledButton
            disabled={stepButtonLoading}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={() => onClickVerify(domain)}
            size={'small'}
            sx={{
              width: '63px',
              height: '40px !important',
              backgroundColor: '#6E4EFB',
            }}
            variant={'contained'}
          >
            Verify
          </StyledButton>
        );
      case 2:
        return (
          <StyledButton
            disabled={stepButtonLoading || !userName}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={() => onClickSave(domain)}
            size={'small'}
            sx={{
              width: '58px',
              height: '40px !important',
              backgroundColor: '#6E4EFB',
            }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        );
    }
  }, [
    activeStep,
    domain,
    onClickContinue,
    onClickSave,
    onClickVerify,
    stepButtonLoading,
    userName,
  ]);

  return (
    <StyledDialog
      content={renderStepContent}
      disableEscapeKeyDown
      footer={
        <Stack
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'flex-end'}
          pt={3}
          width={'100%'}
        >
          <StyledButton
            id={`account-custom-payment-link-email-button-cancel-${activeStep}`}
            onClick={onCancelDialog}
            size={'small'}
            sx={{
              height: '40px !important',
              color: '#1E1645',
              borderColor: '#DFDEE6 !important',
            }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          {renderStepButton}
        </Stack>
      }
      header={
        <Stack
          alignItems={'flex-start'}
          flexDirection={'column'}
          gap={1.5}
          pb={3}
          width={'100%'}
        >
          <Typography
            color={'#202939'}
            fontSize={18}
            lineHeight={1.2}
            variant={'h6'}
          >
            Add email domain
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ width: '100%' }}
          >
            {steps.map((label, index) => (
              <Step key={`${label}_${index}`}>
                <StepLabel sx={{ '&.Mui-active': { fontWeight: 600 } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      }
      headerSx={{
        bgcolor: '#FBFCFD',
      }}
      open={visible}
      sx={{
        '&.MuiDialog-root': {
          '& .MuiPaper-root': {
            maxWidth: 800,
          },
        },
      }}
    />
  );
};

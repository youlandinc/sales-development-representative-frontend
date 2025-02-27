import { FC, ReactNode, useState } from 'react';
import {
  Avatar,
  Icon,
  Stack,
  Step,
  StepLabel,
  Stepper,
  SxProps,
  Typography,
} from '@mui/material';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import { EmailDomainStateEnum } from '@/types/enum';

import ICON_CONNECTED from './assets/icon_connected.svg';
import ICON_NOT_LINKED from './assets/icon_not_linked.svg';
import ICON_DELETE from './assets/icon_delete.svg';
import ICON_COPY from './assets/icon_copy.svg';
import { useSwitch } from '@/hooks';
import { VerifyEmail } from './VerifyEmail';
import { SettingsCard } from '@/components/molecules';

const steps = ['Enter email domain', 'Verity ownership', 'Choose username'];

const computedProps = (status: EmailDomainStateEnum) => {
  switch (status) {
    case EmailDomainStateEnum.ACTIVE:
      return {
        // color: 'success',
        label: 'Active',
        icon: ICON_CONNECTED,
      };
    case EmailDomainStateEnum.PENDING:
      return {
        // color: 'warning',
        label: 'Waiting for verification',
        icon: ICON_NOT_LINKED,
      };
    case EmailDomainStateEnum.FAILED:
      return {
        // color: 'error',
        label: 'Not linked',
        icon: ICON_NOT_LINKED,
      };
    case EmailDomainStateEnum.SUCCESS:
      return {
        // color: 'success',
        label: 'Please finish setup',
        icon: ICON_NOT_LINKED,
      };
    default:
      return {
        // color: 'error',
        label: 'Not linked',
        icon: ICON_NOT_LINKED,
      };
  }
};

type StyledStatusProps = { status: EmailDomainStateEnum };
const StyledStatus: FC<StyledStatusProps> = ({ status }) => {
  return (
    <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
      <Icon
        component={computedProps(status).icon}
        sx={{ width: 18, height: 18 }}
      />
      <Typography lineHeight={1.6} variant={'body3'}>
        {computedProps(status).label}
      </Typography>
    </Stack>
  );
};

type StyledCardProps = {
  title: ReactNode;
  handleDelete?: () => void;
  status?: EmailDomainStateEnum;
  sx?: SxProps;
};
const StyledCard: FC<StyledCardProps> = ({
  title,
  status,
  handleDelete,
  sx,
}) => {
  return (
    <Stack
      border={'1px solid #DFDEE6'}
      borderRadius={2}
      gap={1}
      maxWidth={435}
      p={1.5}
      sx={{
        '&:hover': {
          borderColor: '#6E4EFB',
        },
        ...sx,
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography component={'div'} variant={'subtitle2'}>
          {title}
        </Typography>
        {handleDelete && (
          <Icon
            component={ICON_DELETE}
            onClick={handleDelete}
            sx={{ width: 20, height: 20, cursor: 'pointer' }}
          />
        )}
      </Stack>
      {status && <StyledStatus status={status} />}
    </Stack>
  );
};

export const EmailConfig = () => {
  const [domain, setDomain] = useState('');
  const [userName, setUserName] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const { open, close, visible } = useSwitch();

  const renderStepButton = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <StyledButton
            /*   loading={state.loading}
                 onClick={async () => {
                 if (domain.trim() === '') {
                 setErrors(['Email not be empty']);
                 return;
                 }
                 await setCustomEmail();
                 }}*/
            size={'small'}
            sx={{
              py: '6px !important',
            }}
            variant={'contained'}
          >
            Continue
          </StyledButton>
        );
      case 1:
        return (
          <StyledButton
            // loading={verificationState.loading}
            loadingText={'Searching...'}
            size={'small'}
            sx={{
              py: '6px !important',
            }}
            variant={'contained'}
            /*  onClick={async () => {
                 await verifyDomain();
                 }}*/
          >
            Verify now
          </StyledButton>
        );
      case 2:
        return (
          <StyledButton
            /*       loading={updateState.loading}
                 onClick={async () => {
                 if (userName.trim() === '') {
                 setErrors(['Username not be empty']);
                 return;
                 }
                 await updateEmailDomain(id, userName);
                 }}*/
            size={'small'}
            sx={{
              py: '6px !important',
            }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        );
    }
  };

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <Stack gap={1.5} py={3}>
            <Typography color={'#636A7C'} variant={'body2'}>
              Please enter your custom email domain. For example, if your email
              is admin@example-domain.com, this would be{' '}
              <strong>custom-domain.com.</strong> Note: we do not support
              sending emails from email providers such as Gmail or Outlook.
            </Typography>
            <StyledTextField
              label={'Custom email domain'}
              onChange={(e) => {
                setDomain(e.target.value);
                // if (!regexVerifyUrl.test(e.target.value)) {
                //   setErrors(['Invalid domain']);
                // } else {
                //   setErrors(undefined);
                // }
              }}
              required
              // validate={errors}
              value={domain}
            />
          </Stack>
        );
      case 1:
        return <VerifyEmail domains={[]} />;
      case 2:
        return (
          <Stack py={3} spacing={1.5}>
            <Typography color={'info.A100'} variant={'subtitle1'}>
              Please enter your username for the email. For example, if your
              email is admin@example-domain.com, this would be{' '}
              <strong>admin.</strong>
            </Typography>
            <StyledTextField
              label={'Username'}
              onChange={(e) => {
                // if (!regexVerifyEmailUserName.test(e.target.value)) {
                //   setErrors(['Incorrect input format']);
                // } else if (e.target.value.length > 64) {
                //   setErrors(['Max of 64 characters here']);
                // } else {
                //   setErrors(undefined);
                // }
                setUserName(e.target.value);
              }}
              required
              // validate={errors}
              value={userName}
            />
          </Stack>
        );
    }
  };

  return (
    <SettingsCard title={'Email'}>
      <Stack gap={2}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          maxWidth={900}
        >
          <Typography>Connected email address</Typography>
          <StyledButton
            color={'info'}
            onClick={open}
            size={'small'}
            sx={{ py: '6px !important' }}
            variant={'outlined'}
          >
            Add new domain
          </StyledButton>
        </Stack>
        <StyledCard
          handleDelete={() => {
            return;
          }}
          status={EmailDomainStateEnum.ACTIVE}
          title={'Jarvis@youland.com'}
        />
      </Stack>
      <Stack gap={2}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          maxWidth={900}
        >
          <Typography>Reply-to email address</Typography>
          <StyledButton
            color={'info'}
            onClick={open}
            size={'small'}
            sx={{ py: '6px !important' }}
            variant={'outlined'}
          >
            Add new domain
          </StyledButton>
        </Stack>
        <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <StyledCard
              handleDelete={() => {
                return;
              }}
              key={index}
              status={EmailDomainStateEnum.PENDING}
              sx={{ width: 435 }}
              title={
                <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                  <Typography variant={'subtitle2'}>
                    Jarvis@youland.com
                  </Typography>
                  <Icon
                    component={ICON_COPY}
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                </Stack>
              }
            />
          ))}
        </Stack>
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
              size={'small'}
              sx={{ py: '6px !important' }}
              variant={'outlined'}
            >
              Add name
            </StyledButton>
          </Stack>
          <StyledCard
            handleDelete={() => {
              return;
            }}
            sx={{ width: 435 }}
            title={
              <Stack alignItems={'center'} flexDirection={'row'} gap={2}>
                <Avatar sx={{ width: 40, height: 40 }}>Y</Avatar>
                <Typography variant={'subtitle2'}>Youland</Typography>
              </Stack>
            }
          />
        </Stack>
      </Stack>
      <StyledDialog
        content={
          <Stack gap={3} pt={1.5}>
            <Stack
              alignItems={'flex-start'}
              flexDirection={'column'}
              spacing={1.5}
              width={'100%'}
            >
              <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
                {steps.map((label, index) => (
                  <Step key={`${label}_${index}`} /*sx={{ flex: 0 }}*/>
                    <StepLabel
                      sx={{
                        '& .MuiStepIcon-root.Mui-active': { color: '#6E4EFB' },
                        '& .Mui-active': { fontWeight: 600 },
                        '& .MuiStepLabel-label': { fontWeight: 600 },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>
            {renderStepContent(activeStep)}
          </Stack>
        }
        disableEscapeKeyDown
        footer={
          <Stack
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'flex-end'}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={() => {
                close();
              }}
              size={'small'}
              sx={{
                py: '6px !important',
              }}
              variant={'outlined'}
            >
              {activeStep === 1 ? 'Close' : 'Cancel'}
            </StyledButton>

            {renderStepButton(activeStep)}
          </Stack>
        }
        header={'Change email domain'}
        headerSx={{
          bgcolor: '#FBFCFD',
        }}
        onClose={close}
        open={visible}
        sx={{
          '&.MuiDialog-root': {
            '& .MuiPaper-root': {
              maxWidth: 900,
            },
          },
        }}
      />
      {/*<StyledDialog
         content={
         <Typography my={3} variant={'subtitle1'}>
         Are you sure you want to delete {deleteContent}?
         </Typography>
         }
         disableEscapeKeyDown
         footer={
         <Stack flexDirection={'row'} gap={1.5}>
         <StyledButton
         color={'info'}
         onClick={deleteClose}
         size={'small'}
         sx={{
         borderRadius: 3,
         height: 36,
         }}
         variant={'outlined'}
         >
         Cancel
         </StyledButton>
         <StyledButton
         color={'error'}
         loading={deleteState.loading}
         onClick={async () => {
         await deleteEmailDomain(id);
         }}
         size={'small'}
         sx={{
         borderRadius: 3,
         height: 36,
         }}
         variant={'contained'}
         >
         Delete
         </StyledButton>
         </Stack>
         }
         header={
         <Stack alignItems={'center'} flexDirection={'row'}>
         <DeleteForeverOutlined sx={{ mr: 1.5, fontSize: 24 }} />
         <Typography color={'text.primary'} variant={'h6'}>
         Delete domain?
         </Typography>
         </Stack>
         }
         onClose={deleteClose}
         open={deleteVisible}
         sx={{
         '&.MuiDialog-root': {
         '& .MuiPaper-root': {
         maxWidth: 600,
         },
         },
         }}
         />*/}
    </SettingsCard>
  );
};

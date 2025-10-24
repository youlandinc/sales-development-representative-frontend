import { FC } from 'react';
import { Divider, Stack, Typography } from '@mui/material';

//import { useSwitch } from '@/hooks';
//import { EmailDomainStateEnum } from '@/types/enum';
import {
  SettingsEmailDomain,
  SettingsEmailProfile,
  SettingsEmailSignature,
} from './index';

//import ICON_COPY from './assets/icon_copy.svg';

export const SettingsEmails: FC = () => {
  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={3} p={3}>
      <Typography component={'div'} lineHeight={1.2} variant={'h6'}>
        Email
      </Typography>
      {/*<Stack gap={2}>*/}
      {/*  <Stack*/}
      {/*    alignItems={'center'}*/}
      {/*    flexDirection={'row'}*/}
      {/*    justifyContent={'space-between'}*/}
      {/*    maxWidth={900}*/}
      {/*  >*/}
      {/*    <Typography>Connected email address</Typography>*/}
      {/*    <StyledButton*/}
      {/*      color={'info'}*/}
      {/*      onClick={open}*/}
      {/*      size={'small'}*/}
      {/*      sx={{ py: '6px !important' }}*/}
      {/*      variant={'outlined'}*/}
      {/*    >*/}
      {/*      Add new domain*/}
      {/*    </StyledButton>*/}
      {/*  </Stack>*/}
      {/*  <SettingsCardEmail*/}
      {/*    handleDelete={() => {*/}
      {/*      return;*/}
      {/*    }}*/}
      {/*    status={EmailDomainStateEnum.active}*/}
      {/*    title={'Jarvis@youland.com'}*/}
      {/*  />*/}
      {/*</Stack>*/}
      {/*<Stack gap={2}>*/}
      {/*  <Stack*/}
      {/*    alignItems={'center'}*/}
      {/*    flexDirection={'row'}*/}
      {/*    justifyContent={'space-between'}*/}
      {/*    maxWidth={900}*/}
      {/*  >*/}
      {/*    <Typography>Reply-to email address</Typography>*/}
      {/*    <StyledButton*/}
      {/*      color={'info'}*/}
      {/*      onClick={open}*/}
      {/*      size={'small'}*/}
      {/*      sx={{ py: '6px !important' }}*/}
      {/*      variant={'outlined'}*/}
      {/*    >*/}
      {/*      Add new domain*/}
      {/*    </StyledButton>*/}
      {/*  </Stack>*/}
      {/*  <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>*/}
      {/*    {[1, 2, 3, 4, 5].map((_, index) => (*/}
      {/*      <SettingsCardEmail*/}
      {/*        handleDelete={() => {*/}
      {/*          return;*/}
      {/*        }}*/}
      {/*        key={index}*/}
      {/*        status={EmailDomainStateEnum.pending}*/}
      {/*        sx={{ width: 435 }}*/}
      {/*        title={*/}
      {/*          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>*/}
      {/*            <Typography variant={'subtitle2'}>*/}
      {/*              Jarvis@youland.com*/}
      {/*            </Typography>*/}
      {/*            <Icon*/}
      {/*              component={ICON_COPY}*/}
      {/*              sx={{ width: 20, height: 20, cursor: 'pointer' }}*/}
      {/*            />*/}
      {/*          </Stack>*/}
      {/*        }*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*  </Stack>*/}
      {/*</Stack>*/}
      <Stack divider={<Divider sx={{ borderColor: '#D0CEDA' }} />} gap={3}>
        <SettingsEmailProfile />
        <SettingsEmailDomain />
        <SettingsEmailSignature />
      </Stack>
    </Stack>
  );
};

//const steps = ['Enter email domain', 'Verity ownership', 'Choose username'];

//const [domain, setDomain] = useState('');
//const [userName, setUserName] = useState('');
//const [activeStep, setActiveStep] = useState(0);

//const { open, close, visible } = useSwitch();

//const renderStepButton = (activeStep: number) => {
//  switch (activeStep) {
//    case 0:
//      return (
//        <StyledButton
//          /*   loading={state.loading}
//               onClick={async () => {
//               if (domain.trim() === '') {
//               setErrors(['Email not be empty']);
//               return;
//               }
//               await setCustomEmail();
//               }}*/
//          size={'small'}
//          sx={{
//            py: '6px !important',
//          }}
//          variant={'contained'}
//        >
//          Continue
//        </StyledButton>
//      );
//    case 1:
//      return (
//        <StyledButton
//          // loading={verificationState.loading}
//          loadingText={'Searching...'}
//          size={'small'}
//          sx={{
//            py: '6px !important',
//          }}
//          variant={'contained'}
//          /*  onClick={async () => {
//               await verifyDomain();
//               }}*/
//        >
//          Verify now
//        </StyledButton>
//      );
//    case 2:
//      return (
//        <StyledButton
//          /*       loading={updateState.loading}
//               onClick={async () => {
//               if (userName.trim() === '') {
//               setErrors(['Username not be empty']);
//               return;
//               }
//               await updateEmailDomain(id, userName);
//               }}*/
//          size={'small'}
//          sx={{
//            py: '6px !important',
//          }}
//          variant={'contained'}
//        >
//          Save
//        </StyledButton>
//      );
//  }
//};

//const renderStepContent = (activeStep: number) => {
//  switch (activeStep) {
//    case 0:
//      return (
//        <Stack gap={1.5} py={3}>
//          <Typography color={'#636A7C'} variant={'body2'}>
//            Please enter your custom email domain. For example, if your email
//            is admin@example-domain.com, this would be{' '}
//            <strong>custom-domain.com.</strong> Note: we do not support
//            sending emails from email providers such as Gmail or Outlook.
//          </Typography>
//          <StyledTextField
//            label={'Custom email domain'}
//            onChange={(e) => {
//              setDomain(e.target.value);
//              // if (!regexVerifyUrl.test(e.target.value)) {
//              //   setErrors(['Invalid domain']);
//              // } else {
//              //   setErrors(undefined);
//              // }
//            }}
//            required
//            // validate={errors}
//            value={domain}
//          />
//        </Stack>
//      );
//    case 1:
//      return <SettingsEmailVerify domains={[]} />;
//    case 2:
//      return (
//        <Stack py={3} spacing={1.5}>
//          <Typography color={'info.A100'} variant={'subtitle1'}>
//            Please enter your username for the email. For example, if your
//            email is admin@example-domain.com, this would be{' '}
//            <strong>admin.</strong>
//          </Typography>
//          <StyledTextField
//            label={'Username'}
//            onChange={(e) => {
//              // if (!regexVerifyEmailUserName.test(e.target.value)) {
//              //   setErrors(['Incorrect input format']);
//              // } else if (e.target.value.length > 64) {
//              //   setErrors(['Max of 64 characters here']);
//              // } else {
//              //   setErrors(undefined);
//              // }
//              setUserName(e.target.value);
//            }}
//            required
//            // validate={errors}
//            value={userName}
//          />
//        </Stack>
//      );
//  }
//};

//<StyledDialog
//    content={
//      <Stack gap={3} pt={1.5}>
//        <Stack
//            alignItems={'flex-start'}
//            flexDirection={'column'}
//            spacing={1.5}
//            width={'100%'}
//        >
//          <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
//            {steps.map((label, index) => (
//                <Step key={`${label}_${index}`} /*sx={{ flex: 0 }}*/>
//                  <StepLabel
//                      sx={{
//                        '& .MuiStepIcon-root.Mui-active': { color: '#6E4EFB' },
//                        '& .Mui-active': { fontWeight: 600 },
//                        '& .MuiStepLabel-label': { fontWeight: 600 },
//                      }}
//                  >
//                    {label}
//                  </StepLabel>
//                </Step>
//            ))}
//          </Stepper>
//        </Stack>
//        {renderStepContent(activeStep)}
//      </Stack>
//    }
//    disableEscapeKeyDown
//    footer={
//      <Stack
//          flexDirection={'row'}
//          gap={1.5}
//          justifyContent={'flex-end'}
//          width={'100%'}
//      >
//        <StyledButton
//            color={'info'}
//            onClick={() => {
//              close();
//            }}
//            size={'small'}
//            sx={{
//              py: '6px !important',
//            }}
//            variant={'outlined'}
//        >
//          {activeStep === 1 ? 'Close' : 'Cancel'}
//        </StyledButton>
//
//        {renderStepButton(activeStep)}
//      </Stack>
//    }
//    header={'Change email domain'}
//    headerSx={{
//      bgcolor: '#FBFCFD',
//    }}
//    onClose={close}
//    open={visible}
//    sx={{
//      '&.MuiDialog-root': {
//        '& .MuiPaper-root': {
//          maxWidth: 900,
//        },
//      },
//    }}
///>

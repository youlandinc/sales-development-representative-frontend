import { FC, ReactNode } from 'react';
import { EmailDomainStateEnum } from '@/types';
import { Icon, Stack, SxProps, Typography } from '@mui/material';

import ICON_CONNECTED from './assets/icon_connected.svg';
import ICON_NOT_LINKED from './assets/icon_not_linked.svg';
import ICON_DELETE from './assets/icon_delete.svg';
//import ICON_COPY from './assets/icon_copy.svg';

type StyledCardProps = {
  title: ReactNode;
  handleDelete?: () => void;
  status?: EmailDomainStateEnum;
  sx?: SxProps;
};

export const SettingsCardEmail: FC<StyledCardProps> = ({
  title,
  status,
  handleDelete,
  sx,
}) => {
  const computedProps = (status: EmailDomainStateEnum) => {
    switch (status) {
      case EmailDomainStateEnum.active:
        return {
          // color: 'success',
          label: 'Active',
          icon: ICON_CONNECTED,
        };
      case EmailDomainStateEnum.pending:
        return {
          // color: 'warning',
          label: 'Waiting for verification',
          icon: ICON_NOT_LINKED,
        };
      case EmailDomainStateEnum.failed:
        return {
          // color: 'error',
          label: 'Not linked',
          icon: ICON_NOT_LINKED,
        };
      case EmailDomainStateEnum.success:
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

  return (
    <>
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
          <Icon
            component={ICON_DELETE}
            onClick={handleDelete}
            sx={{ width: 20, height: 20, cursor: 'pointer' }}
          />
        </Stack>
        {status && (
          <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
            <Icon
              component={computedProps(status).icon}
              sx={{ width: 18, height: 18 }}
            />
            <Typography lineHeight={1.6} variant={'body3'}>
              {computedProps(status).label}
            </Typography>
          </Stack>
        )}
      </Stack>
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
    </>
  );
};

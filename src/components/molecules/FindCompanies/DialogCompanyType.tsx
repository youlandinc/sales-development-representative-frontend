import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { SourceFromOpt } from '@/types';

import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import ICON_CLOSE from '@/components/molecules/FindCompanies/assets/icon_close.svg';

type TypeCardProps = {
  title: string;
  icon: string;
  desc: string;
  checked?: boolean;
  handleClick?: (item: SourceFromOpt) => void;
  data: SourceFromOpt;
};
const TypeCard: FC<TypeCardProps> = ({
  title,
  icon,
  desc,
  handleClick,
  checked,
  data,
}) => {
  return (
    <Stack
      bgcolor={'#F7F4FD'}
      borderRadius={4}
      flex={1}
      gap={1.5}
      onClick={() => {
        handleClick?.(data);
      }}
      p={3}
      sx={{
        outline: '1px solid #DFDEE6',
        '&:hover': {
          bgcolor: '#EFE9FB',
        },
        cursor: 'pointer',
        bgcolor: checked ? '#EFE9FB' : '#fff',
        outlineWidth: checked ? '2px' : '1px',
        outlineColor: checked ? '#6E4EFB' : '#DFDEE6',
      }}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Image alt={title} height={24} src={icon} width={24} />
        <Typography lineHeight={1.2} variant={'subtitle2'}>
          {title}
        </Typography>
      </Stack>
      <Typography variant={'body3'}>{desc}</Typography>
    </Stack>
  );
};

type DialogCompanyTypeProps = {
  cb?: (SourceFromOpt: SourceFromOpt) => void;
};

export const DialogCompanyType: FC<DialogCompanyTypeProps> = ({ cb }) => {
  const {
    sourceFromOpts,
    setCheckedSource,
    dialogSourceFromOpen,
    setDialogSourceFromOpen,
    checkedSource,
    fetchFiltersByType,
  } = useFindPeopleCompanyStore((store) => store);
  const [checked, setChecked] = useState<SourceFromOpt>({
    bizId: '',
    title: '',
    logo: '',
    description: '',
    headers: [],
  });

  return (
    <StyledDialog
      content={
        <Stack flexDirection={'row'} gap={3} py={3}>
          {sourceFromOpts.map((item, index) => (
            <TypeCard
              checked={checked.bizId === item.bizId}
              data={item}
              desc={item.description}
              handleClick={setChecked}
              icon={item.logo}
              key={index}
              title={item.title}
            />
          ))}
        </Stack>
      }
      footer={
        <StyledButton
          onClick={() => {
            setDialogSourceFromOpen(false);
            setCheckedSource(checked);
            if (checked.bizId !== checkedSource.bizId) {
              fetchFiltersByType();
            }
            cb?.(checked);
          }}
          size={'medium'}
        >
          Continue
        </StyledButton>
      }
      header={
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography color={'inherit'} fontSize={20} fontWeight={'inherit'}>
            What type of companies are you looking for?
          </Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={() => setDialogSourceFromOpen(false)}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={() => setDialogSourceFromOpen(false)}
      open={dialogSourceFromOpen}
      slotProps={{
        paper: {
          sx: {
            maxWidth: '1200px !important',
          },
        },
      }}
    />
  );
};

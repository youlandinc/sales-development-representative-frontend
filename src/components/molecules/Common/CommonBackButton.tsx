import { FC, ReactNode } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import ICON_ARROW from '@/components/molecules/Library/assets/icon_arrow.svg';

type CommonBackButtonProps = {
  title?: ReactNode;
  handleBack?: () => void;
  backPath?: string;
};

export const CommonBackButton: FC<CommonBackButtonProps> = ({
  title,
  handleBack,
  backPath,
}) => {
  const router = useRouter();

  return (
    <Stack alignItems={'center'} flexDirection={'row'} gap={3} lineHeight={0}>
      <Stack
        height={'100%'}
        justifyContent={'center'}
        onClick={() => {
          if (handleBack) {
            handleBack();
          } else {
            backPath && router.push(backPath);
          }
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Icon component={ICON_ARROW} sx={{ width: 20, height: 20 }} />
      </Stack>
      <Typography variant={'h6'}>{title}</Typography>
    </Stack>
  );
};

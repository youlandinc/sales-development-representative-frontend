import { FC, PropsWithChildren, ReactNode } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import Image from 'next/image';

import { SDRToast, StyledButton } from '@/components/atoms';
import { ContentBox, LibraryCard } from '@/components/molecules';

import { HttpVariantEnum } from '@/types';

import ICON_DELETE from './assets/icon_delete.svg';

type LibraryOffersCardProps = {
  title?: ReactNode;
  handleDelete?: () => void;
};

const LibraryOffersCard: FC<PropsWithChildren<LibraryOffersCardProps>> = ({
  title,
  handleDelete,
  children,
}) => {
  return (
    <LibraryCard
      sx={{ width: '30%' }}
      title={
        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography component={'div'} fontWeight={600} lineHeight={1.2}>
            {title}
          </Typography>
          <Icon
            component={ICON_DELETE}
            onClick={handleDelete}
            sx={{ width: 20, height: 20, cursor: 'pointer' }}
          />
        </Stack>
      }
    >
      <Stack gap={1.5}>{children}</Stack>
    </LibraryCard>
  );
};

export const LibraryOffersMain = () => {
  const router = useRouter();

  return (
    <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>
      <LibraryOffersCard
        handleDelete={() => {
          SDRToast({
            header: 'Delete successfully!',
            variant: HttpVariantEnum.success,
            message: undefined,
          });
        }}
        title={'Stabilized Bridge Loan'}
      >
        <Box flex={1.5}>
          <Image
            alt={'picture'}
            height={377}
            layout={'responsive'}
            src={'/images/demo_image_offers.png'}
            width={969}
          />
        </Box>
        <ContentBox>
          Short- term financing for purchase and refinance of investment
          properties with high leverage, up to 75% LTV.
        </ContentBox>

        <ContentBox>
          YouLand is a technology-driven digital real estate lending platform
          that offers a variety of financing solutions for real estate investors
          across all 50 states in the United States. Their services include
          bridge loans, DSCR rental loans, and all-cash home purchase loans,
          aiming to simplify real estate loan transactions through data and
          algorithm-driven end-to-end solutions. Their technology-driven
          platform automates the initiation, approval, and servicing processes
          of loans, enhancing efficiency and reducing costs. As a direct lender,
          YouLand eliminates intermediaries, providing clients with more
          competitive loan products and a seamless borrowing experience.
          Headquartered in San Francisco, California, YouLand is committed to
          offering fast and flexible financing solutions to real estate
          investors nationwide.
        </ContentBox>
      </LibraryOffersCard>
      <LibraryOffersCard
        handleDelete={() => {
          SDRToast({
            header: 'Delete successfully!',
            variant: HttpVariantEnum.success,
            message: undefined,
          });
        }}
        title={'Fix and Flip Loan'}
      >
        <Box>
          <Image
            alt={'picture'}
            height={243}
            layout={'responsive'}
            src={'/images/demo_image_offers.png'}
            width={483}
          />
        </Box>
        <ContentBox>
          YouLand is a technology-driven digital real estate lending platform
          that offers a variety of financing solutions for real estate investors
          across all 50 states in the United States. Their services include
          bridge loans, DSCR rental loans, and all-cash home purchase loans,
          aiming to simplify real estate loan transactions through data and
          algorithm-driven end-to-end solutions. Their technology-driven
          platform automates the initiation, approval, and servicing processes
          of loans, enhancing efficiency and reducing costs. As a direct lender,
          YouLand eliminates intermediaries, providing clients with more
          competitive loan products and a seamless borrowing experience.
          Headquartered in San Francisco, California, YouLand is committed to
          offering fast and flexible financing solutions to real estate
          investors nationwide.
        </ContentBox>

        <ContentBox>
          YouLand is a technology-driven digital real estate lending platform
          that offers a variety of financing solutions for real estate investors
          across all 50 states in the United States. Their services include
          bridge loans, DSCR rental loans, and all-cash home purchase loans,
          aiming to simplify real estate loan transactions through data and
          algorithm-driven end-to-end solutions. Their technology-driven
          platform automates the initiation, approval, and servicing processes
          of loans, enhancing efficiency and reducing costs. As a direct lender,
          YouLand eliminates intermediaries, providing clients with more
          competitive loan products and a seamless borrowing experience.
          Headquartered in San Francisco, California, YouLand is committed to
          offering fast and flexible financing solutions to real estate
          investors nationwide.
        </ContentBox>
      </LibraryOffersCard>
      <StyledButton
        color={'info'}
        onClick={() => {
          router.push('/library/offers');
        }}
        size={'medium'}
        sx={{ px: '12px !important', py: '6px !important' }}
        variant={'outlined'}
      >
        Add new offer
      </StyledButton>
    </Stack>
  );
};

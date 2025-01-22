import { FC, PropsWithChildren } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import Image from 'next/image';

import { StyledButton } from '@/components/atoms';
import {
  LibraryCard,
  LibraryCardProps,
  ScrollTabs,
} from '@/components/molecules';

import ICON_BUILDINGS from './assets/icon_buildings.svg';

const commonStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '3',
  display: '-webkit-box',
  width: '100%',
};

const LibraryCompanyCard: FC<PropsWithChildren<LibraryCardProps>> = ({
  children,
  ...rest
}) => {
  return (
    <LibraryCard sx={{ width: '33%' }} {...rest}>
      <Stack gap={1.5}>{children}</Stack>
    </LibraryCard>
  );
};

export const ContentBox: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box border={'1px solid #DFDEE6'} borderRadius={2} p={1.5}>
      <Typography sx={commonStyle} variant={'body2'}>
        {children}
      </Typography>
    </Box>
  );
};

export const LibraryCompanyMain = () => {
  const router = useRouter();

  return (
    <Stack gap={3}>
      <LibraryCard
        icon={
          <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
        }
        title={
          <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
            <Typography fontWeight={600} lineHeight={1.2}>
              Company overview
            </Typography>
            <StyledButton
              color={'info'}
              onClick={() => {
                router.push('/library/company/123');
              }}
              size={'medium'}
              sx={{
                px: '12px !important',
                py: '6px !important',
                fontSize: '12px !important',
                lineHeight: 1,
                height: 'auto !important',
              }}
              variant={'outlined'}
            >
              Edit
            </StyledButton>
          </Stack>
        }
      >
        <Stack flexDirection={'row'} gap={1.25} width={'100%'}>
          <Typography
            flex={1}
            lineHeight={1.7}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '15',
              display: '-webkit-box',
            }}
            variant={'body2'}
          >
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States. Their services
            include bridge loans, DSCR rental loans, and all-cash home purchase
            loans, aiming to simplify real estate loan transactions through data
            and algorithm-driven end-to-end solutions. Their technology-driven
            platform automates the initiation, approval, and servicing processes
            of loans, enhancing efficiency and reducing costs. As a direct
            lender, YouLand eliminates intermediaries, providing clients with
            more competitive loan products and a seamless borrowing experience.
            Headquartered in San Francisco, California, YouLand is committed to
            offering fast and flexible financing solutions to real estate
            investors nationwide.
          </Typography>
          <Box flex={1.5}>
            <Image
              alt={'picture'}
              height={377}
              layout={'responsive'}
              src={'/images/demo_image_company.png'}
              width={969}
            />
          </Box>
        </Stack>
      </LibraryCard>
      <Stack flexDirection={'row'} gap={3}>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Pain points'}
        >
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
        </LibraryCompanyCard>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Solutions'}
        >
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
        </LibraryCompanyCard>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Proof points'}
        >
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
          <ContentBox>
            YouLand is a technology-driven digital real estate lending platform
            that offers a variety of financing solutions for real estate
            investors across all 50 states in the United States.
          </ContentBox>
        </LibraryCompanyCard>
      </Stack>
      <ScrollTabs />
    </Stack>
  );
};

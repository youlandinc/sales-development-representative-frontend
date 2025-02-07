import { FC, PropsWithChildren, ReactNode } from 'react';
import {
  Box,
  Collapse,
  Drawer,
  DrawerProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { CommonReceiptCardHeader } from '@/components/molecules';

import { useSwitch } from '@/hooks';

import ICON_LINKEDIN from './assets/icon_linkedin.svg';
import ICON_ARROW_DOWN from './assets/icon_arrow.svg';
import ICON_BUILDING from './assets/icon_building.svg';
import ICON_IDENTIFICATION from './assets/icon_identification.svg';
import ICON_CLOSE from './assets/icon_close.svg';

type CollapseCardProps = {
  title?: ReactNode;
};

const CollapseCard: FC<PropsWithChildren<CollapseCardProps>> = ({
  title,
  children,
}) => {
  const { visible, open, close } = useSwitch(true);
  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={1.25} p={2}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={2}
        onClick={visible ? close : open}
        sx={{ cursor: 'pointer' }}
      >
        <Icon
          component={ICON_ARROW_DOWN}
          sx={{
            width: 18,
            height: 18,
            transform: `rotate(${visible ? 0 : '-90'}deg)`,
            transition: 'all 0.3s ease-in-out',
          }}
        />
        <Typography component={'div'} variant={'body2'}>
          {title}
        </Typography>
      </Stack>
      <Collapse in={visible}>{children}</Collapse>
    </Stack>
  );
};

type CommonCampaignUserInfoProps = DrawerProps;

export const CommonCampaignUserInfo: FC<CommonCampaignUserInfoProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      anchor={'right'}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { px: 3, py: 6, maxWidth: (1300 * 100) / 1920 + '%' } }}
    >
      <Stack gap={3} p={2}>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <CommonReceiptCardHeader
            avatarName={'JA'}
            avatarSx={{ width: 40, height: 40, fontSize: 16 }}
            email={
              <Stack gap={'2px'}>
                <Stack alignItems={'center'} flexDirection={'row'} gap={'4px'}>
                  <Typography component={'span'} variant={'subtitle2'}>
                    Johnny Appleseed
                  </Typography>
                  <Icon
                    component={ICON_LINKEDIN}
                    sx={{ width: 18, height: 18 }}
                  />
                </Stack>
                <Typography color={'info'} component={'span'} variant={'body2'}>
                  Broker Manager @ ABC Company
                </Typography>
              </Stack>
            }
          />
          <Icon
            component={ICON_CLOSE}
            onClick={onClose}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
        <CollapseCard
          title={
            <Stack alignItems={'center'} flexDirection={'row'} gap={2}>
              <StyledButton color={'info'} size={'medium'} variant={'outlined'}>
                <Stack flexDirection={'row'} gap={'4px'}>
                  <Icon
                    component={ICON_BUILDING}
                    sx={{ width: 18, height: 18 }}
                  />
                  <Typography variant={'body3'}>Company research</Typography>
                </Stack>
              </StyledButton>
              <StyledButton color={'info'} size={'medium'} variant={'outlined'}>
                <Stack flexDirection={'row'} gap={'4px'}>
                  <Icon
                    component={ICON_IDENTIFICATION}
                    sx={{ width: 18, height: 18 }}
                  />
                  <Typography variant={'body3'}>Personal research</Typography>
                </Stack>
              </StyledButton>
            </Stack>
          }
        >
          <Typography variant={'body3'}>
            Overview John Doe works as a Senior Real Estate Agent at Prime
            Realty, a leading real estate firm with over 200 employees. He
            specializes in residential properties, guiding clients through the
            buying and selling process with expertise in the local market. John
            manages a team of junior agents and works closely with property
            developers to drive sales and customer satisfaction.
          </Typography>
        </CollapseCard>
        <CollapseCard title={'Campaigns'}>
          <Stack gap={1.25}>
            <Stack gap={1.5} p={1.25}>
              <Typography fontWeight={600} variant={'body3'}>
                Johnny Appleseed
                <Box
                  color={'info.main'}
                  component={'span'}
                  fontWeight={400}
                  pl={1}
                >
                  Sep 12, 4:17 AM
                </Box>
              </Typography>
              <Typography fontWeight={600} variant={'body3'}>
                Elementum varius nisi vel tempus. Donec eleifend egestas
                viverra.
              </Typography>
              <Typography variant={'body3'}>
                Hello Dear Sir Good Morning, Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Curabitur non diam facilisis,
                commodo libero et, commodo sapien. Pellentesque sollicitudin
                massa sagittis dolor facilisis, sit amet vulputate nunc
                molestie. Pellentesque maximus nibh id luctus porta. Ut
                consectetur dui nec nulla mattis luctus. Donec nisi diam, congue
                vitae felis at, ullamcorper bibendum tortor. Vestibulum
                pellentesque felis felis. Etiam ac tortor felis. Ut elit arcu,
                rhoncus in laoreet vel, gravida sed tortor. In elementum varius
                nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus
                sollicitudin blandit. Donec scelerisque purus sit amet feugiat
                efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris
                lacus felis, consequat nec pellentesque viverra, venenatis a
                lorem. Sed urna lectus.Quisque feugiat semper sapien vel
                hendrerit
              </Typography>
            </Stack>
          </Stack>
        </CollapseCard>
      </Stack>
    </Drawer>
  );
};

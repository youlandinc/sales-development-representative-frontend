import {
  Collapse,
  Icon,
  Stack,
  StackProps,
  SxProps,
  Typography,
} from '@mui/material';
import { ElementType, FC, ReactNode } from 'react';

import { useSwitch } from '@/hooks';

import { StyledCost } from '@/components/atoms';
import { StyledIntegrationCost } from './StyledIntegrationCost';

import { ActionsChildrenTypeEnum } from '@/types';

import ICON_ARROW from '@/components/molecules/ProspectDetail/assets/dialog/icon_arrow_down.svg';

type HeaderMenuItemProps = {
  icon?: ElementType;
  title: string;
  titleSx?: SxProps;
  slot?: ReactNode;
  type?: ActionsChildrenTypeEnum;
  integrationCost?: number;
  integrationIcon?: ElementType;
  cost?: number;
} & Omit<StackProps, 'slot' | 'children'>;

type DialogHeaderActionsMenus = HeaderMenuItemProps & {
  children?: HeaderMenuItemProps[];
};

export const HeaderMenuItem: FC<HeaderMenuItemProps> = ({
  title,
  onClick,
  icon,
  titleSx,
  slot,
  sx,
  ...rest
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      onClick={onClick}
      // px={1.5}
      py={0.5}
      sx={{
        cursor: 'pointer',
        ...sx,
      }}
      {...rest}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={0.5}
        justifyContent={'space-between'}
      >
        {icon && <Icon component={icon} sx={{ width: 20, height: 20 }} />}
        <Typography fontSize={14} lineHeight={1.2} sx={titleSx}>
          {title}
        </Typography>
      </Stack>
      {slot}
      {/* <CostCoins border={'1px solid #D0CEDA'} borderRadius={1} count={'0.5'} /> */}
    </Stack>
  );
};

export const DialogHeaderActionsMenus: FC<DialogHeaderActionsMenus> = ({
  icon,
  title,
  children,
}) => {
  const { visible, toggle } = useSwitch(true);

  return (
    <Stack gap={1.5}>
      <HeaderMenuItem
        icon={icon}
        onClick={toggle}
        slot={
          <Icon
            component={ICON_ARROW}
            sx={{
              width: 16,
              height: 16,
              transform: visible ? 'rotate(0deg)' : 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'all .3s',
            }}
          />
        }
        title={title}
        titleSx={{ fontWeight: 600 }}
      />
      {Array.isArray(children) && (
        <Collapse in={visible}>
          <Stack gap={1.5}>
            {children.map((item, index) => (
              <HeaderMenuItem
                icon={item?.icon}
                key={index}
                onClick={item?.onClick}
                slot={
                  item?.type === 'integration' ? (
                    <StyledIntegrationCost
                      cost={item?.cost || 0}
                      integrationCost={item?.integrationCost || 0}
                      integrationIcon={item?.integrationIcon}
                    />
                  ) : (
                    <StyledCost
                      border={'1px solid #D0CEDA'}
                      borderRadius={1}
                      count={'0.5'}
                    />
                  )
                }
                sx={{
                  px: 1.5,
                  '&:hover': {
                    bgcolor: '#F7F4FD',
                  },
                }}
                title={item.title}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

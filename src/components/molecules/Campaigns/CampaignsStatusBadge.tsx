import { FC } from 'react';
import { SxProps, Typography } from '@mui/material';
import { CampaignStatusEnum } from '@/types';

const computedStyles = (status: CampaignStatusEnum) => {
  switch (status) {
    case CampaignStatusEnum.draft:
      return {
        color: '#9095A3',
        backgroundColor: '#F0F4FF',
        label: 'Draft',
      };
    case CampaignStatusEnum.active:
      return {
        color: '#43A788',
        backgroundColor: 'rgba(105, 192, 165, 0.10)',
        label: 'Active',
      };
    case CampaignStatusEnum.done:
      return {
        color: '#7849D7',
        backgroundColor: 'rgba(120, 73, 215, 0.20)',
        label: 'Completed',
      };
    case CampaignStatusEnum.suspended:
      return {
        color: '#7D7D7D',
        backgroundColor: '#F0F0F0',
        label: 'Suspended',
      };
    default:
      return {
        color: '#9095A3',
        backgroundColor: '#F0F4FF',
        label: 'Draft',
      };
  }
};

type StyledCampaignStatusProps = {
  status: CampaignStatusEnum;
  sx?: SxProps;
};

export const CampaignsStatusBadge: FC<StyledCampaignStatusProps> = ({
  status,
  sx,
}) => {
  return (
    <Typography
      bgcolor={computedStyles(status).backgroundColor}
      borderRadius={1}
      color={computedStyles(status).color}
      px={1.25}
      py={'2px'}
      sx={sx}
      variant={'subtitle3'}
      width={'fit-content'}
    >
      {computedStyles(status).label}
    </Typography>
  );
};

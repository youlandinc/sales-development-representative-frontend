import React, { FC } from 'react';
import { Typography } from '@mui/material';

enum CampaignStatus {
  draft = 'DRAFT',
  active = 'ACTIVE',
  done = 'DONE',
  suspended = 'SUSPENDED',
}

const computedStyles = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.draft:
      return {
        color: '#9095A3',
        backgroundColor: '#F0F4FF',
        label: 'Draft',
      };
    case CampaignStatus.active:
      return {
        color: '#43A788',
        backgroundColor: 'rgba(105, 192, 165, 0.10)',
        label: 'Active',
      };
    case CampaignStatus.done:
      return {
        color: '#7849D7',
        backgroundColor: 'rgba(120, 73, 215, 0.20)',
        label: 'Done',
      };
    case CampaignStatus.suspended:
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
  status: CampaignStatus;
};

export const StyledCampaignStatus: FC<StyledCampaignStatusProps> = ({
  status,
}) => {
  return (
    <Typography
      bgcolor={computedStyles(status).backgroundColor}
      borderRadius={1}
      color={computedStyles(status).color}
      px={1.25}
      py={'2px'}
      variant={'subtitle3'}
      width={'fit-content'}
    >
      {computedStyles(status).label}
    </Typography>
  );
};

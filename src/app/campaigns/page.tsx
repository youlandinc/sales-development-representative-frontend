'use client';
export const fetchCache = 'force-no-store';

import { StyledLayout } from '@/components/atoms';
import { Campaigns } from '@/components/organisms';

const CampaignsPage = () => {
  return (
    <StyledLayout>
      <Campaigns />
    </StyledLayout>
  );
};

export default CampaignsPage;

'use client';

export const fetchCache = 'force-no-store';

import { useRouter } from 'nextjs-toploader/app';

import { StyledLayout } from '@/components/atoms';

const CampaignsPage = () => {
  return (
    <StyledLayout>
      <h1>Campaigns</h1>
    </StyledLayout>
  );
};

export default CampaignsPage;

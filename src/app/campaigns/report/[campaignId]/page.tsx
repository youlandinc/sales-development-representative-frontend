'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { CampaignsPending } from '@/components/organisms/CampaignsPending';

const CampaignsPendingPage = () => {
  useEffect(() => {
    document.title = 'Campaigns - Corepass SalesOS';
  }, []);
  return <CampaignsPending />;
};

export default CampaignsPendingPage;

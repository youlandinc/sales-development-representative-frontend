'use client';
import { CampaignsPending } from '@/components/organisms/CampaignsPending';

export const fetchCache = 'force-no-store';

const CampaignsPendingPage = () => {
  return <CampaignsPending />;
};

export default CampaignsPendingPage;

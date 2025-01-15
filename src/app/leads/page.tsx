'use client';

export const fetchCache = 'force-no-store';

import { useRouter } from 'nextjs-toploader/app';

import { StyledLayout } from '@/components/atoms';

const LeadsPage = () => {
  return (
    <StyledLayout>
      <h1>LeadsPage</h1>
    </StyledLayout>
  );
};

export default LeadsPage;

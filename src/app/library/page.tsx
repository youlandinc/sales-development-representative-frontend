'use client';

export const fetchCache = 'force-no-store';

import { useRouter } from 'nextjs-toploader/app';

import { StyledLayout } from '@/components/atoms';

const LibraryPage = () => {
  return (
    <StyledLayout>
      <h1>LibraryPage</h1>
    </StyledLayout>
  );
};

export default LibraryPage;

'use client';
export const fetchCache = 'force-no-store';

import { StyledLayout } from '@/components/atoms';
import { Inbox } from '@/components/organisms';

const InboxPage = () => {
  return (
    <StyledLayout>
      <Inbox />
    </StyledLayout>
  );
};

export default InboxPage;

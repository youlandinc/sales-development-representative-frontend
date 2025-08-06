'use client';

import { useParams } from 'next/navigation';

export const fetchCache = 'force-no-store';

const ProsectAndEnrichDetail = (props: any) => {
  const { tableId } = useParams();
  return <>{tableId}</>;
};

export default ProsectAndEnrichDetail;

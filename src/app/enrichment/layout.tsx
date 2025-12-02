import { WSProvider } from '@/providers';

export default function ProspectEnrichLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WSProvider>{children}</WSProvider>;
  //return children;
}

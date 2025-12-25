import { WSProvider } from '@/providers';

export default function EnrichLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WSProvider>{children}</WSProvider>;
  //return children;
}

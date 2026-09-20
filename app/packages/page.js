import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PackagesBody from '@/components/pages/PackagesBody';

export const revalidate = 60;

export const metadata = {
  title: 'Health Packages · Kinder Hospitals',
  description: 'Explore Kinder hospital maternity and health check-up packages, inclusions and eligibility.',
};

export default async function PackagesPage() {
  const content = await getContent();
  return (
    <SiteChrome content={content}>
      <PackagesBody content={content} />
    </SiteChrome>
  );
}

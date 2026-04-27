import { loadAnalytics } from '@/lib/analytics-data';
import { AnalyticsClient } from './AnalyticsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
  const data = await loadAnalytics();
  return <AnalyticsClient data={data} />;
}

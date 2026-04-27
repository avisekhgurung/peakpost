import { loadDashboard } from '@/lib/dashboard-data';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const data = await loadDashboard();
  return <DashboardClient data={data} />;
}

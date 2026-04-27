import { AppShell } from "@/components/app/AppShell";
import { loadSidebarContext } from "@/lib/user-context";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await loadSidebarContext();
  if (!ctx) redirect("/login");
  return <AppShell ctx={ctx}>{children}</AppShell>;
}

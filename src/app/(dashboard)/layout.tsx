import { getProfile } from "@/lib/actions/profile";
import DashboardClient from "./dashboard-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return <DashboardClient profile={profile}>{children}</DashboardClient>;
}

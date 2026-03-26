import { getProfile } from "@/lib/actions/profile";
import DashboardClient from "./dashboard-client";
import { unstable_noStore as noStore } from "next/cache";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Disable caching for this layout to always fetch fresh profile data
  noStore();
  
  const profile = await getProfile();

  return <DashboardClient profile={profile}>{children}</DashboardClient>;
}

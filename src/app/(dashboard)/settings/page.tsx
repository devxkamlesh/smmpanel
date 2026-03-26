import { getProfile } from "@/lib/actions/profile";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";
import { unstable_noStore as noStore } from "next/cache";

export default async function SettingsPage() {
  // Disable caching to always get fresh profile data
  noStore();
  
  const profile = await getProfile();

  if (!profile) {
    console.error("No profile found, redirecting to login");
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface">Settings</h1>
        <p className="text-on-surface-variant mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsClient profile={profile} />
    </div>
  );
}

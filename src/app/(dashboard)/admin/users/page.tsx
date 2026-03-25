import { getAllUsers } from "@/lib/actions/admin";
import UsersClient from "./users-client";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-2">User Management</h2>
          <p className="text-on-surface-variant">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">{users.length} Users</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <UsersClient users={users} />
      </div>
    </div>
  );
}

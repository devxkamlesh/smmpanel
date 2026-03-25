"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { updateUserRole, updateUserStatus, updateUserBalance, deleteUser } from "@/lib/actions/admin";
import { Trash2, Edit, Shield, Ban, CheckCircle } from "lucide-react";

export default function UsersClient({ users }: { users: Profile[] }) {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (userId: string, role: "user" | "admin" | "reseller") => {
    setLoading(true);
    try {
      await updateUserRole(userId, role);
      window.location.reload();
    } catch (error) {
      alert("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: "active" | "suspended" | "banned") => {
    setLoading(true);
    try {
      await updateUserStatus(userId, status);
      window.location.reload();
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async (userId: string, balance: number) => {
    setLoading(true);
    try {
      await updateUserBalance(userId, balance);
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to update balance");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(true);
    try {
      await deleteUser(userId);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/10 text-green-500",
      suspended: "bg-yellow-500/10 text-yellow-500",
      banned: "bg-red-500/10 text-red-500",
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-purple-500/10 text-purple-500",
      reseller: "bg-blue-500/10 text-blue-500",
      user: "bg-gray-500/10 text-gray-500",
    };
    return styles[role as keyof typeof styles] || styles.user;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{user.username[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">{user.username}</p>
                      <p className="text-xs text-on-surface-variant">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)} border-0 cursor-pointer`}
                  >
                    <option value="user">User</option>
                    <option value="reseller">Reseller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)} border-0 cursor-pointer`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                  ${Number(user.balance).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                  ${Number(user.total_spent).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-surface-container transition-colors"
                      title="Edit Balance"
                    >
                      <Edit className="w-4 h-4 text-on-surface-variant" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-on-surface mb-4">Edit User Balance</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              User: {selectedUser.username}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const balance = Number(formData.get("balance"));
                handleBalanceUpdate(selectedUser.id, balance);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface mb-2">
                  New Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  step="0.01"
                  defaultValue={selectedUser.balance}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

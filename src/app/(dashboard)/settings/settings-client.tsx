"use client";

import { useState } from "react";
import { updateProfile, changePassword, generateApiKey } from "@/lib/actions/profile-update";
import { User, Mail, Lock, Key, Loader2, CheckCircle2, AlertCircle, Copy, Eye, EyeOff } from "lucide-react";
import type { Profile } from "@/types";

interface SettingsClientProps {
  profile: Profile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "api">("profile");
  
  // Profile form
  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [email, setEmail] = useState(profile.email);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // API key
  const [apiKey, setApiKey] = useState(profile.api_key || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const result = await updateProfile({
        username,
        full_name: fullName,
        email,
      });

      if (result.success) {
        setProfileSuccess(result.message || "Profile updated successfully");
      } else {
        setProfileError(result.error || "Failed to update profile");
      }
    } catch (error: any) {
      setProfileError(error.message || "An error occurred");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        setPasswordSuccess(result.message || "Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.error || "Failed to change password");
      }
    } catch (error: any) {
      setPasswordError(error.message || "An error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!confirm("Generate new API key? This will invalidate your current key.")) return;

    setApiLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      const result = await generateApiKey();

      if (result.success && result.apiKey) {
        setApiKey(result.apiKey);
        setApiSuccess(result.message || "API key generated successfully");
        setShowApiKey(true);
      } else {
        setApiError(result.error || "Failed to generate API key");
      }
    } catch (error: any) {
      setApiError(error.message || "An error occurred");
    } finally {
      setApiLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "api" as const, label: "API Key", icon: Key },
  ];

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-card"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-bold text-on-surface mb-4">Account Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-on-surface-variant mb-1">Role</p>
              <p className="text-on-surface font-medium capitalize">{profile.role}</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Status</p>
              <p className="text-on-surface font-medium capitalize">{profile.status}</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Member Since</p>
              <p className="text-on-surface font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="bg-surface-container-lowest rounded-2xl p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Profile Information</h3>
              <p className="text-sm text-on-surface-variant">Update your account details</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Username <span className="text-error">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Changing email will require verification
              </p>
            </div>

            {profileError && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-error-container/20 border border-error/20">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{profileError}</p>
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">{profileSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="bg-surface-container-lowest rounded-2xl p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Change Password</h3>
              <p className="text-sm text-on-surface-variant">Update your password to keep your account secure</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Current Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                New Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Confirm New Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {passwordError && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-error-container/20 border border-error/20">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">{passwordSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        )}

        {/* API Key Tab */}
        {activeTab === "api" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">API Key</h3>
              <p className="text-sm text-on-surface-variant">Use this key to access our API programmatically</p>
            </div>

            {apiKey ? (
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Your API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="w-full px-4 py-3 pr-24 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
                      title={showApiKey ? "Hide" : "Show"}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKey)}
                      className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Keep this key secret. Do not share it publicly.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-surface-container text-center">
                <Key className="w-12 h-12 mx-auto mb-3 text-on-surface-variant" />
                <p className="text-sm text-on-surface-variant">
                  No API key generated yet
                </p>
              </div>
            )}

            {apiError && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-error-container/20 border border-error/20">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{apiError}</p>
              </div>
            )}

            {apiSuccess && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">{apiSuccess}</p>
              </div>
            )}

            <button
              onClick={handleGenerateApiKey}
              disabled={apiLoading}
              className="w-full px-6 py-3 rounded-xl bg-secondary text-on-secondary font-semibold hover:bg-secondary-container transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {apiLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  {apiKey ? "Regenerate API Key" : "Generate API Key"}
                </>
              )}
            </button>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-on-surface mb-2">API Documentation</h4>
              <p className="text-xs text-on-surface-variant mb-3">
                Learn how to use our API to integrate with your applications
              </p>
              <a
                href="/api-docs"
                className="inline-block px-4 py-2 rounded-lg bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors"
              >
                View API Docs
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

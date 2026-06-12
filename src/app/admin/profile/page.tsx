"use client";

import { useEffect, useState } from "react";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";

import { api } from "@/lib/api";
import {
  AdminButton, AdminCard, Field, Input, toast,
} from "@/components/admin/AdminUI";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminProfilePage() {
  const { user, refresh } = useAdminAuth();

  const [info, setInfo] = useState({ name: "", email: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (user) setInfo({ name: user.name, email: user.email });
  }, [user]);

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!info.name || !info.email) { toast("Name and email are required.", "error"); return; }
    setSavingInfo(true);
    try {
      await api.updateProfile({ name: info.name, email: info.email });
      toast("Profile updated");
      refresh?.();
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleSavePwd(e: React.FormEvent) {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword) { toast("All password fields are required.", "error"); return; }
    if (pwd.newPassword !== pwd.confirm) { toast("New passwords do not match.", "error"); return; }
    if (pwd.newPassword.length < 6) { toast("New password must be at least 6 characters.", "error"); return; }
    setSavingPwd(true);
    try {
      await api.updateProfile({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast("Password changed");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setSavingPwd(false);
    }
  }

  if (!user) {
    return (
      <div className="grid place-items-center py-24">
        <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Profile Info */}
      <AdminCard className="p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-primary-800">
            <FaUser className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-ink">Personal Information</h2>
            <p className="text-xs text-ink-muted">Update your name and email address.</p>
          </div>
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-4">
          <Field label="Full Name" required>
            <Input
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              placeholder="Your name"
            />
          </Field>
          <Field label="Email Address" required>
            <Input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              placeholder="you@example.com"
            />
          </Field>
          <div className="flex justify-end pt-2">
            <AdminButton type="submit" loading={savingInfo}>Save Changes</AdminButton>
          </div>
        </form>
      </AdminCard>

      {/* Change Password */}
      <AdminCard className="p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-primary-800">
            <FaLock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-ink">Change Password</h2>
            <p className="text-xs text-ink-muted">Choose a strong password with at least 6 characters.</p>
          </div>
        </div>

        <form onSubmit={handleSavePwd} className="space-y-4">
          <Field label="Current Password" required>
            <Input
              type="password"
              value={pwd.currentPassword}
              onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
              placeholder="••••••••"
            />
          </Field>
          <Field label="New Password" required>
            <Input
              type="password"
              value={pwd.newPassword}
              onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Confirm New Password" required>
            <Input
              type="password"
              value={pwd.confirm}
              onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
              placeholder="••••••••"
            />
          </Field>
          <div className="flex justify-end pt-2">
            <AdminButton type="submit" loading={savingPwd}>Change Password</AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaAt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaIdBadge,
  FaInfoCircle,
  FaKey,
  FaLock,
  FaShieldAlt,
  FaSignOutAlt,
  FaSpinner,
  FaSyncAlt,
  FaUser,
  FaUserShield,
} from "react-icons/fa";

import { api } from "@/lib/api";
import {
  AdminButton,
  AdminCard,
  Field,
  Input,
  toast,
} from "@/components/admin/AdminUI";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/utils";

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { label: "Contains a number", test: (value: string) => /\d/.test(value) },
  { label: "Contains a letter", test: (value: string) => /[a-z]/i.test(value) },
  { label: "Uses mixed case", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
];

const securityNotes = [
  "Keep your admin email reachable for login recovery.",
  "Use a password you do not use on supplier or personal accounts.",
  "Sign out on shared systems after updating products or orders.",
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "A";
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function AdminProfilePage() {
  const { user, refresh, logout } = useAdminAuth();

  const [info, setInfo] = useState({ name: "", email: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [lastSynced, setLastSynced] = useState("");

  useEffect(() => {
    if (user) setInfo({ name: user.name, email: user.email });
  }, [user]);

  useEffect(() => {
    setLastSynced(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, []);

  const completedRules = useMemo(
    () => PASSWORD_RULES.filter((rule) => rule.test(pwd.newPassword)).length,
    [pwd.newPassword],
  );

  const passwordStrength = useMemo(() => {
    if (!pwd.newPassword) return { label: "Not started", bar: "w-0 bg-primary-200", text: "text-ink-muted" };
    if (completedRules <= 1) return { label: "Weak", bar: "w-1/4 bg-red-500", text: "text-red-700" };
    if (completedRules === 2) return { label: "Fair", bar: "w-1/2 bg-amber-500", text: "text-amber-700" };
    if (completedRules === 3) return { label: "Good", bar: "w-3/4 bg-blue-500", text: "text-blue-700" };
    return { label: "Strong", bar: "w-full bg-emerald-600", text: "text-emerald-700" };
  }, [completedRules, pwd.newPassword]);

  const infoChanged = Boolean(
    user &&
      (info.name.trim() !== user.name || info.email.trim().toLowerCase() !== user.email.toLowerCase()),
  );

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    const nextInfo = { name: info.name.trim(), email: info.email.trim() };

    if (!nextInfo.name || !nextInfo.email) {
      toast("Name and email are required.", "error");
      return;
    }

    setSavingInfo(true);
    try {
      await api.updateProfile(nextInfo);
      setInfo(nextInfo);
      await refresh?.();
      setLastSynced(
        new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast("Profile updated");
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleSavePwd(e: React.FormEvent) {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirm) {
      toast("All password fields are required.", "error");
      return;
    }
    if (pwd.newPassword !== pwd.confirm) {
      toast("New passwords do not match.", "error");
      return;
    }
    if (pwd.newPassword.length < 6) {
      toast("New password must be at least 6 characters.", "error");
      return;
    }

    setSavingPwd(true);
    try {
      await api.updateProfile({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      toast("Password changed");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      setShowPasswords(false);
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setSavingPwd(false);
    }
  }

  async function handleRefresh() {
    try {
      await refresh?.();
      setLastSynced(
        new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast("Account details refreshed");
    } catch (err) {
      console.log(err);
      toast((err as Error).message, "error");
    }
  }

  if (!user) {
    return (
      <div className="grid place-items-center py-24">
        <FaSpinner className="h-7 w-7 animate-spin text-primary-800" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <AdminCard className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-primary-900 p-4 text-white sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white text-2xl font-extrabold text-primary-900 shadow-soft sm:h-20 sm:w-20 sm:text-3xl">
                {initials(user.name)}
              </div>
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest-x text-cream-100">
                  <FaUserShield className="h-3 w-3 text-secondary" />
                  Admin profile
                </div>
                <h2 className="display break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  {user.name}
                </h2>
                <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-xs font-bold">
                  <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-cream-100">
                    <FaEnvelope className="h-3 w-3 shrink-0 text-secondary" />
                    <span className="min-w-0 break-all">{user.email}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-white">
                    <FaIdBadge className="h-3 w-3 shrink-0" />
                    {roleLabel(user.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid content-center gap-4 bg-white p-4 sm:p-6 md:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                  <FaClock className="h-3 w-3 text-secondary" />
                  Last synced
                </div>
                <div className="text-sm font-extrabold text-ink">
                  {lastSynced || "Checking..."}
                </div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-emerald-800">
                  <FaCheckCircle className="h-3 w-3 text-emerald-600" />
                  Account status
                </div>
                <div className="text-sm font-extrabold text-emerald-800">
                  Active session
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminButton type="button" variant="outline" onClick={handleRefresh} className="flex-1 sm:flex-none">
                <FaSyncAlt className="h-3.5 w-3.5" />
                Refresh
              </AdminButton>
              <AdminButton type="button" variant="ghost" onClick={logout} className="flex-1 sm:flex-none">
                <FaSignOutAlt className="h-3.5 w-3.5" />
                Sign out
              </AdminButton>
            </div>
          </div>
        </div>
      </AdminCard>

      <div className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <AdminCard className="p-4 sm:p-6 md:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-100 text-primary-800">
                  <FaUser className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">
                    Personal information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    Keep the name and email shown across the admin workspace up to date.
                  </p>
                </div>
              </div>
              {infoChanged && (
                <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                  <FaInfoCircle className="h-3.5 w-3.5" />
                  Unsaved changes
                </span>
              )}
            </div>

            <form onSubmit={handleSaveInfo} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full Name" required>
                  <Input
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email Address" required>
                  <Input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-3 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-ink-muted">
                  Email changes may affect future password reset requests.
                </p>
                <div className="flex flex-wrap gap-3">
                  <AdminButton
                    type="button"
                    variant="ghost"
                    disabled={!infoChanged || savingInfo}
                    onClick={() => setInfo({ name: user.name, email: user.email })}
                    className="flex-1 sm:flex-none"
                  >
                    Reset
                  </AdminButton>
                  <AdminButton type="submit" loading={savingInfo} disabled={!infoChanged} className="flex-1 sm:flex-none">
                    Save changes
                  </AdminButton>
                </div>
              </div>
            </form>
          </AdminCard>

          <AdminCard className="p-4 sm:p-6 md:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-100 text-primary-800">
                  <FaLock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">
                    Change password
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    Update your password regularly to protect product, order and customer data.
                  </p>
                </div>
              </div>
              <AdminButton
                type="button"
                variant="outline"
                onClick={() => setShowPasswords((value) => !value)}
                className="w-fit"
              >
                {showPasswords ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                {showPasswords ? "Hide" : "Show"}
              </AdminButton>
            </div>

            <form onSubmit={handleSavePwd} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Current Password" required>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={pwd.currentPassword}
                    onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                    placeholder="********"
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="New Password" required>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                    placeholder="********"
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm New Password" required>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={pwd.confirm}
                    onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                    placeholder="********"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest-x text-primary-800">
                    Password strength
                  </span>
                  <span className={cn("text-xs font-extrabold", passwordStrength.text)}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className={cn("h-full rounded-full transition-all", passwordStrength.bar)} />
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(pwd.newPassword);
                    return (
                      <div
                        key={rule.label}
                        className={cn(
                          "flex items-center gap-2 text-xs font-bold",
                          passed ? "text-emerald-700" : "text-ink-muted",
                        )}
                      >
                        <FaCheckCircle className={cn("h-3.5 w-3.5 shrink-0", passed ? "text-emerald-600" : "text-primary-200")} />
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-ink-muted">
                  You will stay signed in after a successful password update.
                </p>
                <AdminButton type="submit" loading={savingPwd} className="sm:w-fit">
                  Change password
                </AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>

        <aside className="min-w-0 space-y-4 sm:space-y-6">
          <AdminCard className="p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-100 text-primary-800">
                <FaAt className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-ink">Account details</h3>
                <p className="text-xs font-semibold text-ink-muted">
                  Identity used by the admin panel.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { label: "User ID", value: user.id, Icon: FaKey },
                { label: "Name", value: user.name, Icon: FaUser },
                { label: "Email", value: user.email, Icon: FaEnvelope },
                { label: "Role", value: roleLabel(user.role), Icon: FaIdBadge },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="rounded-lg border border-primary-100 bg-white p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                    <Icon className="h-3 w-3 text-secondary" />
                    {label}
                  </div>
                  <div className="break-words text-sm font-bold text-ink">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <FaShieldAlt className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-ink">Security checklist</h3>
                <p className="text-xs font-semibold text-ink-muted">
                  Quick habits for safer admin work.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {securityNotes.map((note) => (
                <div
                  key={note}
                  className="flex gap-3 rounded-lg border border-primary-100 bg-primary-50 p-3 text-sm font-semibold leading-6 text-ink-soft"
                >
                  <FaCheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  {note}
                </div>
              ))}
            </div>
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
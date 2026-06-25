"use client";

import { useState, FormEvent, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { FaLock, FaEnvelope, FaSpinner, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { api } from "@/lib/api";
import { siteConfig } from "@/data/site";
import Link from "next/link";

type Step = "login" | "forgot" | "otp" | "reset" | "done";

function BrandLogo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={`group flex min-w-0 items-center gap-3 sm:gap-4 ${className ?? ""}`}>
      {siteConfig.logo ? (
        <img src={siteConfig.logo} alt={siteConfig.name} className="h-10 w-10 shrink-0 object-cover sm:h-11 sm:w-11" />
      ) : (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-xl font-bold uppercase text-primary-950 sm:h-12 sm:w-12 sm:text-2xl">
          {siteConfig?.name?.charAt(0) || "T"}
        </div>
      )}
      <div className="min-w-0 leading-tight">
        <div className={`display truncate text-lg font-semibold tracking-tight sm:text-xl ${dark ? "text-cream-50" : "text-primary-900"}`}>
          {siteConfig.name}
        </div>
        <div className={`text-[10px] uppercase tracking-widest-x font-semibold ${dark ? "text-cream-100/60" : "text-secondary-dark"}`}>
          Admin Panel
        </div>
      </div>
    </Link>
  );
}

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [step, setStep] = useState<Step>("login");

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot / otp / reset shared state
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Login ────────────────────────────────────────────────────────────────
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message || "Login failed");
      setLoading(false);
    }
  }

  // ── Forgot password ───────────────────────────────────────────────────────
  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.forgotPassword(fpEmail);
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
    } catch (err) {
      setError((err as Error).message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // ── Verify OTP ────────────────────────────────────────────────────────────
  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit OTP"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyOtp(fpEmail, code);
      setResetToken(res.resetToken ?? "");
      setNewPassword("");
      setConfirmPassword("");
      setStep("reset");
    } catch (err) {
      setError((err as Error).message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  // ── Reset password ────────────────────────────────────────────────────────
  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setLoading(true);
    try {
      await api.resetPassword(resetToken, newPassword);
      setSuccess("Password reset successfully! You can now sign in.");
      setStep("done");
    } catch (err) {
      setError((err as Error).message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input helpers ─────────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  }

  function goBack() {
    setError("");
    if (step === "forgot") setStep("login");
    else if (step === "otp") setStep("forgot");
    else if (step === "reset") setStep("otp");
    else if (step === "done") setStep("login");
  }

  // ── Shared UI pieces ──────────────────────────────────────────────────────
  function ErrorBox() {
    if (!error) return null;
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
    return (
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-800 text-cream-50 py-3 text-sm font-semibold hover:bg-primary-900 disabled:opacity-60 transition"
      >
        {loading && <FaSpinner className="h-3.5 w-3.5 animate-spin" />}
        {loading ? loadingLabel : label}
      </button>
    );
  }

  function BackButton() {
    return (
      <button
        type="button"
        onClick={goBack}
        className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-primary-800 transition"
      >
        <FaArrowLeft className="h-3 w-3" /> Back
      </button>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="admin-login grid min-h-svh bg-cream-50 lg:grid-cols-5">
      {/* Visual side */}
      <div className="hidden lg:flex lg:col-span-2 relative bg-primary-950 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 bg-weave-dark opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/90 to-primary-950" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <BrandLogo dark />
          <div>
            <div className="text-[11px] uppercase tracking-widest-x text-secondary-light font-semibold mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-secondary" /> Welcome back
            </div>
            <h2 className="display text-5xl font-semibold leading-tight">
              Manage cloth stock, orders and shop content in one place.
            </h2>
            <p className="mt-5 text-cream-100/70 leading-relaxed max-w-md">
              Update retail products, wholesale enquiries, banners and customer reviews without leaving the admin desk.
            </p>
          </div>
          <div className="text-xs text-cream-100/50">
            {siteConfig.address.city} · {siteConfig.address.state} · Manufacturing since {siteConfig.established}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex min-h-svh items-center justify-center px-4 py-6 sm:px-6 lg:col-span-3 lg:p-12">
        <div className="w-full max-w-md rounded-xl border border-cream-200 bg-white/95 p-5 shadow-soft sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <BrandLogo className="mb-6 lg:hidden" />

          {/* ── STEP: login ── */}
          {step === "login" && (
            <>
              <h1 className="display text-3xl font-semibold text-primary-950 sm:text-4xl">Sign in</h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">Enter your admin credentials to continue.</p>

              <form onSubmit={handleLogin} className="mt-7 space-y-5 sm:mt-10">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-2">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.in"
                      className="w-full rounded-lg border border-cream-300 bg-white py-3 pl-11 pr-4 text-base focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10 sm:text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-cream-300 bg-white py-3 pl-11 pr-4 text-base focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10 sm:text-sm"
                    />
                  </div>
                </div>

                <ErrorBox />

                <SubmitButton label="Sign in" loadingLabel="Signing in…" />

                <p className="text-xs text-ink-muted text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setError(""); setFpEmail(email); setStep("forgot"); }}
                    className="text-primary-700 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── STEP: forgot ── */}
          {step === "forgot" && (
            <>
              <BackButton />
              <h1 className="display mt-4 text-3xl font-semibold text-primary-950 sm:text-4xl">Forgot password</h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">
                Enter your admin email and we'll send a one-time code to reset your password.
              </p>

              <form onSubmit={handleForgot} className="mt-7 space-y-5 sm:mt-10">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-2">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="email"
                      required
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      placeholder="admin@example.in"
                      className="w-full rounded-lg border border-cream-300 bg-white py-3 pl-11 pr-4 text-base focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10 sm:text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                <ErrorBox />
                <SubmitButton label="Send OTP" loadingLabel="Sending…" />
              </form>
            </>
          )}

          {/* ── STEP: otp ── */}
          {step === "otp" && (
            <>
              <BackButton />
              <h1 className="display mt-4 text-3xl font-semibold text-primary-950 sm:text-4xl">Enter OTP</h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">
                A 6-digit code was sent to <span className="break-all font-medium text-primary-800">{fpEmail}</span>. Enter it below.
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-7 space-y-6 sm:mt-10">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-4">One-time code</label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        title={`OTP digit ${i + 1}`}
                        aria-label={`OTP digit ${i + 1}`}
                        placeholder="·"
                        className="aspect-square min-w-0 rounded-lg border border-cream-300 bg-white text-center text-lg font-semibold caret-primary-700 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>

                <ErrorBox />
                <SubmitButton label="Verify OTP" loadingLabel="Verifying…" />

                <p className="text-xs text-ink-muted text-center">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setOtp(["","","","","",""]); handleForgot({ preventDefault: () => {} } as FormEvent); }}
                    className="text-primary-700 hover:underline font-medium"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── STEP: reset ── */}
          {step === "reset" && (
            <>
              <BackButton />
              <h1 className="display mt-4 text-3xl font-semibold text-primary-950 sm:text-4xl">New password</h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">Choose a strong password for your admin account.</p>

              <form onSubmit={handleReset} className="mt-7 space-y-5 sm:mt-10">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-2">New password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-lg border border-cream-300 bg-white py-3 pl-11 pr-4 text-base focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10 sm:text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest-x text-secondary-dark font-semibold mb-2">Confirm password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full rounded-lg border border-cream-300 bg-white py-3 pl-11 pr-4 text-base focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10 sm:text-sm"
                    />
                  </div>
                </div>

                <ErrorBox />
                <SubmitButton label="Set new password" loadingLabel="Saving…" />
              </form>
            </>
          )}

          {/* ── STEP: done ── */}
          {step === "done" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <FaCheckCircle className="h-14 w-14 text-green-500" />
              </div>
              <h1 className="display text-2xl font-semibold text-primary-950 sm:text-3xl">Password updated</h1>
              <p className="text-sm leading-6 text-ink-soft sm:text-base">{success}</p>
              <button
                type="button"
                onClick={() => { setStep("login"); setError(""); setSuccess(""); }}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-primary-800 text-cream-50 py-3 text-sm font-semibold hover:bg-primary-900 transition"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

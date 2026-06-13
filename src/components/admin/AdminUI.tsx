"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaStore,
  FaTags,
  FaTimes,
  FaTrash,
  FaTruckMoving,
  FaUpload,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/utils";

/* -------------------------------- Button -------------------------------- */

export function AdminButton({
  children,
  variant = "primary",
  loading,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
  loading?: boolean;
}) {
  const base =
    "admin-button inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const v = {
    primary: "admin-button-primary bg-primary-600 text-white shadow-soft hover:bg-secondary hover:shadow-warm",
    outline: "admin-button-outline border border-primary-200 bg-white text-primary-800 hover:border-secondary hover:text-secondary",
    ghost: "admin-button-ghost text-ink-soft hover:bg-primary-50 hover:text-primary-800",
    danger: "admin-button-danger bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return (
    <button {...rest} disabled={rest.disabled || loading} className={cn(base, v, className)}>
      {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </button>
  );
}

/* --------------------------------- Card --------------------------------- */

export function AdminCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("admin-card rounded-lg bg-white border border-primary-100 shadow-soft", className)}>
      {children}
    </div>
  );
}

/* --------------------------------- Field -------------------------------- */

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-field-label mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest-x text-primary-800 font-bold">
        <FaTags className="h-3 w-3 text-secondary" />
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {hint && !error && <span className="block text-xs text-ink-muted mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-600 mt-1.5">{error}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "admin-input w-full rounded-lg border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "admin-input w-full rounded-lg border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition resize-y",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "admin-input w-full rounded-lg border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition",
        props.className,
      )}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="admin-toggle inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-secondary" : "bg-cream-300",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-ink-soft">{label}</span>}
    </button>
  );
}

/* --------------------------------- Modal -------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-primary-950/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn("admin-modal w-full overflow-hidden bg-white rounded-lg border border-secondary/30 shadow-warm", maxWidth)}
          >
            <div className="flex items-center justify-between border-b border-primary-100 bg-primary-50 px-6 py-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                  <FaStore className="h-3 w-3" />
                  Retail and wholesale admin
                </div>
                <h3 className="text-xl font-extrabold text-primary-950">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-primary-800 shadow-soft hover:bg-primary-600 hover:text-white transition"
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Confirm dialog -------------------------- */

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, title: "", message: "" });

  const confirm = (title: string, message: string, onConfirm: () => void) =>
    setState({ open: true, title, message, onConfirm });

  const dialog = (
    <Modal open={state.open} onClose={() => setState((s) => ({ ...s, open: false }))} title={state.title}>
      <p className="text-ink-soft leading-relaxed">{state.message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <AdminButton variant="ghost" onClick={() => setState((s) => ({ ...s, open: false }))}>
          Cancel
        </AdminButton>
        <AdminButton
          variant="danger"
          onClick={() => {
            state.onConfirm?.();
            setState((s) => ({ ...s, open: false }));
          }}
        >
          Confirm
        </AdminButton>
      </div>
    </Modal>
  );

  return { confirm, dialog };
}

/* --------------------------------- Toast -------------------------------- */

type Toast = { id: number; kind: "success" | "error"; text: string };
let toastSeq = 0;
const listeners = new Set<(t: Toast) => void>();

export function toast(text: string, kind: "success" | "error" = "success") {
  const t: Toast = { id: ++toastSeq, kind, text };
  listeners.forEach((l) => l(t));
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const onToast = (t: Toast) => {
      setItems((arr) => [...arr, t]);
      setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== t.id)), 3800);
    };
    listeners.add(onToast);
    return () => {
      listeners.delete(onToast);
    };
  }, []);
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-warm text-sm font-bold min-w-[280px]",
              t.kind === "success" ? "border-secondary/30 text-ink" : "border-red-200 text-ink",
            )}
          >
            {t.kind === "success" ? (
              <FaCheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <FaExclamationCircle className="h-4 w-4 text-red-600" />
            )}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Image uploader --------------------------- */

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = "Images",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadToCloudinary(file);
        uploaded.push(res.secure_url);
      }
      if (multiple) onChange([...value, ...uploaded]);
      else onChange([uploaded[0]]);
      toast(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast((e as Error).message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="admin-field-label mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest-x text-primary-800 font-bold">
        <FaTags className="h-3 w-3 text-secondary" />
        {label}
      </div>

      {/* Existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square overflow-hidden rounded-lg border border-primary-100 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-white/95 text-red-600 hover:bg-red-600 hover:text-white transition opacity-0 group-hover:opacity-100 shadow-soft"
                aria-label="Remove"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="block">
        <div
          className={cn(
            "admin-uploader border-2 border-dashed border-primary-200 rounded-lg p-6 text-center cursor-pointer hover:border-secondary hover:bg-primary-50 transition",
            uploading && "opacity-60 pointer-events-none",
          )}
        >
          {uploading ? (
            <>
              <FaSpinner className="h-6 w-6 text-secondary animate-spin mx-auto" />
              <p className="text-sm text-ink-soft mt-2">Uploading…</p>
            </>
          ) : (
            <>
              <FaUpload className="h-6 w-6 text-primary-800 mx-auto" />
              <p className="text-sm font-semibold text-ink-soft mt-2">
                {multiple ? "Click to select images" : "Click to upload"}
              </p>
              <p className="text-xs text-ink-muted mt-1">Cloth photos: JPG, PNG, WebP up to 10MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
}

/* ----------------------------- Stat tile -------------------------------- */

export function StatTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "secondary" | "maroon";
}) {
  return (
    <AdminCard className="admin-stat-tile overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-primary-100 bg-primary-50 px-5 py-4">
        <div className="text-[10px] uppercase tracking-widest-x text-primary-800 font-bold">
          {label}
        </div>
        <span className={cn(
          "grid h-9 w-9 place-items-center rounded-lg text-white",
          accent === "secondary" ? "bg-secondary" : "bg-primary-600",
        )}>
          {accent === "secondary" ? <FaTruckMoving className="h-4 w-4" /> : <FaBoxes className="h-4 w-4" />}
        </span>
      </div>
      <div className="p-5">
        <div
          className={cn(
            "text-4xl font-extrabold",
            accent === "secondary" ? "text-secondary-dark" : "text-primary-950",
          )}
        >
          {value}
        </div>
        {hint && <div className="text-xs font-semibold text-ink-muted mt-2">{hint}</div>}
      </div>
    </AdminCard>
  );
}

/* ----------------------------- Empty state ------------------------------ */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <AdminCard className="p-12 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg bg-primary-50 text-secondary">
        <FaStore className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-extrabold text-primary-950">{title}</h3>
      {description && <p className="text-ink-muted mt-2 leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </AdminCard>
  );
}

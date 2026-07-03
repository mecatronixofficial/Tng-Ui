"use client";

import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaStar, FaCheckCircle, FaTimesCircle, FaHome } from "react-icons/fa";

import { api, TestimonialApi } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, ImageUploader, Input, Modal,
  Select, TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";
import { cn } from "@/utils";

interface FormState {
  name: string; role: string; company: string; location: string;
  rating: number; review: string; image: string; productPurchased: string;
  approved: boolean; featured: boolean; order: number;
}

const emptyForm: FormState = {
  name: "", role: "", company: "", location: "",
  rating: 5, review: "", image: "", productPurchased: "",
  approved: true, featured: false, order: 0,
};

export default function AdminTestimonialsPage() {
  const [list, setList] = useState<TestimonialApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TestimonialApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await api.adminTestimonials());
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(t: TestimonialApi) {
    setEditing(t);
    setForm({
      name: t.name, role: t.role, company: t.company || "",
      location: t.location, rating: t.rating, review: t.review,
      image: t.image || "",
      productPurchased: t.productPurchased || "",
      approved: t.approved, featured: t.featured, order: t.order,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.role || !form.location || !form.review) {
      toast("Name, role, location and review are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        name: form.name,
        role: form.role,
        location: form.location,
        rating: Number(form.rating),
        review: form.review,
        approved: form.approved,
        featured: form.featured,
        order: Number(form.order),
      };
      if (form.company) body.company = form.company;
      if (form.image) body.image = form.image;
      if (form.productPurchased) body.productPurchased = form.productPurchased;

      if (editing) {
        await api.updateTestimonial(editing._id || editing.id!, body);
        toast("Review updated");
      } else {
        await api.createTestimonial(body);
        toast("Review added");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function quickToggle(t: TestimonialApi, field: "approved" | "featured") {
    try {
      await api.updateTestimonial(t._id || t.id!, { [field]: !t[field] });
      toast(`${field} ${!t[field] ? "enabled" : "disabled"}`);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  function handleDelete(t: TestimonialApi) {
    confirm(`Delete review from ${t.name}?`, "This cannot be undone.", async () => {
      try {
        await api.deleteTestimonial(t._id || t.id!);
        toast("Review deleted");
        await load();
      } catch (e) {
        toast((e as Error).message, "error");
      }
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <AdminButton onClick={openCreate}>
          <FaPlus className="h-3 w-3" /> Add Review
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState title="No reviews yet" description="Add customer testimonials to build trust." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {list.map((t) => (
            <AdminCard key={t._id ?? t.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={cn("h-3 w-3", i >= t.rating && "text-cream-300")} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quickToggle(t, "featured")}
                    title={t.featured ? "Remove from Home Page" : "Show on Home Page"}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest-x font-bold transition",
                      t.featured ? "bg-secondary text-primary-950 hover:bg-secondary/80" : "bg-cream-100 text-ink-muted hover:bg-cream-200",
                    )}
                  >
                    <FaHome className="h-2.5 w-2.5" />
                    {t.featured ? "On Home" : "Off Home"}
                  </button>
                  <button
                    type="button"
                    onClick={() => quickToggle(t, "approved")}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest-x font-bold transition",
                      t.approved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200",
                    )}
                  >
                    {t.approved ? <FaCheckCircle className="h-2.5 w-2.5" /> : <FaTimesCircle className="h-2.5 w-2.5" />}
                    {t.approved ? "Approved" : "Pending"}
                  </button>
                </div>
              </div>

              <p className="text-ink-soft leading-relaxed italic">&ldquo;{t.review}&rdquo;</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{t.name}</div>
                  <div className="text-xs text-ink-muted truncate">
                    {t.role}{t.company ? ` · ${t.company}` : ""} · {t.location}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-cream-100 hover:text-primary-800" aria-label="Edit">
                    <FaEdit className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Review" : "Add Review"}>
        <div className="space-y-5">
          <ImageUploader
            value={form.image ? [form.image] : []}
            onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
            label="Customer Image"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Customer Name" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role" required>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Retail Owner" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company">
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
            <Field label="Location" required>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Chennai, TN" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Rating">
              <Select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{"★".repeat(n)} ({n} star{n !== 1 ? "s" : ""})</option>
                ))}
              </Select>
            </Field>
            <Field label="Product Purchased">
              <Input value={form.productPurchased} onChange={(e) => setForm({ ...form, productPurchased: e.target.value })} />
            </Field>
          </div>
          <Field label="Review" required>
            <TextArea rows={5} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
          </Field>
          <Field label="Display Order">
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </Field>
          <div className="flex gap-6 pt-2 border-t border-cream-200">
            <Toggle checked={form.approved} onChange={(v) => setForm({ ...form, approved: v })} label="Approved (visible publicly)" />
            <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Show on Home Page" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Review"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

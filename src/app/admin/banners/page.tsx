"use client";

import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaEyeSlash } from "react-icons/fa";

import { api, BannerApi } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, ImageUploader,
  Input, Modal, Select, TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";

interface FormState {
  kind: "hero" | "opening_card";
  title: string; highlight: string; subtitle: string; eyebrow: string;
  description: string; image: string; ctaLabel: string; ctaHref: string;
  secondaryLabel: string; secondaryHref: string; badge: string;
  expiresAt: string; order: number; active: boolean;
}

const emptyForm: FormState = {
  kind: "hero",
  title: "", highlight: "", subtitle: "", eyebrow: "",
  description: "", image: "", ctaLabel: "", ctaHref: "",
  secondaryLabel: "", secondaryHref: "", badge: "",
  expiresAt: "", order: 0, active: true,
};

export default function AdminBannersPage() {
  const [list, setList] = useState<BannerApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BannerApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await api.adminBanners());
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate(kind: "hero" | "opening_card" = "hero") {
    setEditing(null);
    setForm({ ...emptyForm, kind });
    setOpen(true);
  }

  function openEdit(b: BannerApi) {
    setEditing(b);
    setForm({
      kind: b.kind,
      title: b.title, highlight: b.highlight || "",
      subtitle: b.subtitle || "", eyebrow: b.eyebrow || "",
      description: b.description, image: b.image,
      ctaLabel: b.ctaLabel, ctaHref: b.ctaHref,
      secondaryLabel: b.secondaryLabel || "",
      secondaryHref: b.secondaryHref || "",
      badge: b.badge || "",
      expiresAt: b.expiresAt ? new Date(b.expiresAt).toISOString().slice(0, 16) : "",
      order: b.order, active: b.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.description || !form.image || !form.ctaLabel || !form.ctaHref) {
      toast("Title, description, image and primary CTA are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        kind: form.kind,
        title: form.title,
        description: form.description,
        image: form.image,
        ctaLabel: form.ctaLabel,
        ctaHref: form.ctaHref,
        order: Number(form.order),
        active: form.active,
      };
      if (form.highlight) body.highlight = form.highlight;
      if (form.subtitle) body.subtitle = form.subtitle;
      if (form.eyebrow) body.eyebrow = form.eyebrow;
      if (form.secondaryLabel) body.secondaryLabel = form.secondaryLabel;
      if (form.secondaryHref) body.secondaryHref = form.secondaryHref;
      if (form.badge) body.badge = form.badge;
      if (form.expiresAt) body.expiresAt = new Date(form.expiresAt).toISOString();

      if (editing) {
        await api.updateBanner(editing.id, body);
        toast("Banner updated");
      } else {
        await api.createBanner(body);
        toast("Banner created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(b: BannerApi) {
    confirm("Delete this banner?", "This cannot be undone.", async () => {
      try {
        await api.deleteBanner(b.id);
        toast("Banner deleted");
        await load();
      } catch (e) {
        toast((e as Error).message, "error");
      }
    });
  }

  const heroes = list.filter((b) => b.kind === "hero");
  const openings = list.filter((b) => b.kind === "opening_card");

  return (
    <div>
      <div className="flex flex-wrap justify-end gap-2 mb-6">
        <AdminButton variant="outline" onClick={() => openCreate("opening_card")}>
          <FaPlus className="h-3 w-3" /> Opening Card
        </AdminButton>
        <AdminButton onClick={() => openCreate("hero")}>
          <FaPlus className="h-3 w-3" /> Hero Slide
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState
          title="No banners yet"
          description="Hero slides drive the homepage carousel. Opening cards show as popups on first visit."
          action={<AdminButton onClick={() => openCreate("hero")}><FaPlus className="h-3 w-3" /> Add Hero Slide</AdminButton>}
        />
      ) : (
        <div className="space-y-10">
          {[
            { title: "Hero Slides", items: heroes },
            { title: "Opening Card (Popup)", items: openings },
          ].map(({ title, items }) => (
            <div key={title}>
              <div className="display text-2xl font-semibold text-primary-950 mb-4">{title}</div>
              {items.length === 0 ? (
                <p className="text-sm text-ink-muted">None yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {items.map((b) => (
                    <AdminCard key={b.id} className="overflow-hidden">
                      <div className="relative aspect-[16/9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.image} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-cream-50">
                          {b.eyebrow && (
                            <div className="text-[9px] uppercase tracking-widest-x text-secondary-light font-semibold">
                              {b.eyebrow}
                            </div>
                          )}
                          <div className="display text-xl font-semibold leading-tight">
                            {b.title} {b.highlight && <span className="italic text-secondary-light">{b.highlight}</span>}
                          </div>
                        </div>
                        {!b.active && (
                          <div className="absolute top-3 right-3 rounded-full bg-ink/80 text-cream-50 px-2.5 py-1 text-[9px] uppercase tracking-widest-x font-bold flex items-center gap-1">
                            <FaEyeSlash className="h-2.5 w-2.5" /> Hidden
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="text-xs text-ink-muted">
                          Order #{b.order} · → {b.ctaHref}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(b)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-cream-100 hover:text-primary-800" aria-label="Edit">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete(b)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </AdminCard>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Banner" : `Add ${form.kind === "hero" ? "Hero Slide" : "Opening Card"}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5">
          <ImageUploader
            value={form.image ? [form.image] : []}
            onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
            label="Banner Image"
          />

          <Field label="Type">
            <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as any })}>
              <option value="hero">Hero Slide (homepage carousel)</option>
              <option value="opening_card">Opening Card (popup on first visit)</option>
            </Select>
          </Field>

          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Highlight (italic accent)">
              <Input value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
            </Field>
            <Field label="Subtitle (opening card)">
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </Field>
          </div>

          <Field label="Eyebrow">
            <Input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="New Collection · Festival Sale · ..." />
          </Field>

          <Field label="Description" required>
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary CTA Label" required>
              <Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
            </Field>
            <Field label="Primary CTA URL" required>
              <Input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} placeholder="/products or https://..." />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Secondary CTA Label">
              <Input value={form.secondaryLabel} onChange={(e) => setForm({ ...form, secondaryLabel: e.target.value })} />
            </Field>
            <Field label="Secondary CTA URL">
              <Input value={form.secondaryHref} onChange={(e) => setForm({ ...form, secondaryHref: e.target.value })} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Badge (opening card)">
              <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Limited Time" />
            </Field>
            <Field label="Expires At">
              <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </Field>
            <Field label="Display Order">
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
          </div>

          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" />

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Banner"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

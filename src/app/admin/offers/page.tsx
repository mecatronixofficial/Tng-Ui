"use client";

import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTag, FaEyeSlash } from "react-icons/fa";

import { api, OfferApi } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, ImageUploader, Input, Modal,
  TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";
import { cn } from "@/utils";

interface FormState {
  title: string; description: string; code: string;
  discountPercent: number; expiresAt: string; image: string;
  ctaLabel: string; ctaHref: string; order: number; active: boolean;
}

const emptyForm: FormState = {
  title: "", description: "", code: "",
  discountPercent: 0, expiresAt: "", image: "",
  ctaLabel: "", ctaHref: "", order: 0, active: true,
};

export default function AdminOffersPage() {
  const [list, setList] = useState<OfferApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<OfferApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await api.adminOffers());
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

  function openEdit(o: OfferApi) {
    setEditing(o);
    setForm({
      title: o.title, description: o.description, code: o.code || "",
      discountPercent: o.discountPercent, image: o.image || "",
      expiresAt: new Date(o.expiresAt).toISOString().slice(0, 10),
      ctaLabel: o.ctaLabel || "", ctaHref: o.ctaHref || "",
      order: o.order, active: o.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast("Title is required.", "error"); return; }
    if (!form.description.trim()) { toast("Description is required.", "error"); return; }
    if (!form.expiresAt) { toast("Expiry date is required.", "error"); return; }
    setSaving(true);
    try {
      const body: any = {
        title: form.title,
        description: form.description,
        discountPercent: Number(form.discountPercent),
        expiresAt: new Date(form.expiresAt + "T23:59:59").toISOString(),
        order: Number(form.order),
        active: form.active,
      };
      if (form.code) body.code = form.code;
      if (form.image) body.image = form.image;
      if (form.ctaLabel) body.ctaLabel = form.ctaLabel;
      if (form.ctaHref) body.ctaHref = form.ctaHref;

      if (editing) {
        await api.updateOffer(editing.id, body);
        toast("Offer updated");
      } else {
        await api.createOffer(body);
        toast("Offer created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(o: OfferApi) {
    confirm(`Delete "${o.title}"?`, "This cannot be undone.", async () => {
      try {
        await api.deleteOffer(o.id);
        toast("Offer deleted");
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
          <FaPlus className="h-3 w-3" /> Add Offer
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Add promotional offers shown in the homepage banner."
          action={<AdminButton onClick={openCreate}><FaPlus className="h-3 w-3" /> Add Offer</AdminButton>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {list.map((o) => {
            const expired = new Date(o.expiresAt) < new Date();
            return (
              <AdminCard key={o.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-widest-x font-bold",
                    expired ? "bg-red-100 text-red-700" : "bg-secondary/20 text-secondary-dark",
                  )}>
                    <FaTag className="h-2.5 w-2.5" />
                    {expired ? "Expired" : "Active offer"}
                  </span>
                  {!o.active && <FaEyeSlash className="h-3.5 w-3.5 text-ink-muted" />}
                </div>
                <h3 className="display text-xl font-semibold text-primary-950">{o.title}</h3>
                <p className="text-sm text-ink-soft mt-2">{o.description}</p>
                {o.code && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-cream-300 px-3 py-1.5 text-xs">
                    Code: <span className="font-bold text-secondary-dark">{o.code}</span>
                  </div>
                )}
                <div className="mt-4 text-xs text-ink-muted">
                  Expires {moment(o.expiresAt).format("MMM D, YYYY")}
                </div>
                <div className="mt-4 flex gap-2 pt-4 border-t border-cream-200">
                  <AdminButton variant="outline" onClick={() => openEdit(o)}>
                    <FaEdit className="h-3 w-3" /> Edit
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => handleDelete(o)}>
                    <FaTrash className="h-3 w-3 text-red-600" />
                  </AdminButton>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Offer" : "Add Offer"}>
        <div className="space-y-5">
          <ImageUploader
            value={form.image ? [form.image] : []}
            onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
            label="Offer Image"
          />

          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description" required>
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Promo Code">
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="FESTIVE25" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA Label">
              <Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Shop Now" />
            </Field>
            <Field label="CTA URL">
              <Input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Expires At" required>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </Field>
            <Field label="Display Order">
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
          </div>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" />
          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Offer"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

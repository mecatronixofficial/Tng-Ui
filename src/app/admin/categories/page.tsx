"use client";

import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaEyeSlash } from "react-icons/fa";

import { api, CategoryApi, SubcategoryApi } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, ImageUploader,
  Input, Modal, TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";

interface FormState {
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = {
  name: "", slug: "", description: "", image: "", order: 0, active: true,
};

export default function AdminCategoriesPage() {
  const [list, setList] = useState<CategoryApi[]>([]);
  const [subcategoryMap, setSubcategoryMap] = useState<Map<string, SubcategoryApi[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        api.adminCategories(),
        api.adminSubcategories(),
      ]);
      setList(cats);
      const map = new Map<string, SubcategoryApi[]>();
      for (const sub of subs) {
        const arr = map.get(sub.category) ?? [];
        arr.push(sub);
        map.set(sub.category, arr);
      }
      setSubcategoryMap(map);
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

  function openEdit(c: CategoryApi) {
    setEditing(c);
    setForm({
      name: c.name, slug: c.slug, description: c.description,
      image: c.image, order: c.order, active: c.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.description || !form.image) {
      toast("Name, description and image are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        image: form.image,
        order: Number(form.order),
        active: form.active,
      };
      if (editing) {
        await api.updateCategory(editing.id, body);
        toast("Category updated");
      } else {
        await api.createCategory(body);
        toast("Category created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(c: CategoryApi) {
    confirm(`Delete "${c.name}"?`, "Products in this category will be orphaned.", async () => {
      try {
        await api.deleteCategory(c.id);
        toast("Category deleted");
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
          <FaPlus className="h-3 w-3" /> Add Category
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add product categories to organize your catalogue."
          action={<AdminButton onClick={openCreate}><FaPlus className="h-3 w-3" /> Add Category</AdminButton>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => (
            <AdminCard key={c.id} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
                {!c.active && (
                  <div className="absolute top-3 left-3 rounded-full bg-ink/80 text-cream-50 px-2.5 py-1 text-[9px] uppercase tracking-widest-x font-bold flex items-center gap-1">
                    <FaEyeSlash className="h-2.5 w-2.5" /> Hidden
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="display text-xl font-semibold text-primary-950">{c.name}</h3>
                <p className="text-xs text-ink-muted mt-1">/{c.slug} · {c.productCount} products</p>
                <p className="text-sm text-ink-soft mt-2 line-clamp-2">{c.description}</p>
                {(() => {
                  const subs = subcategoryMap.get(c.slug) ?? [];
                  return subs.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-cream-200">
                      <p className="text-[10px] font-semibold uppercase tracking-widest-x text-ink-muted mb-2">
                        Subcategories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {subs.map((s) => (
                          <span
                            key={s.id}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              s.active
                                ? "bg-primary-50 text-primary-800"
                                : "bg-cream-100 text-ink-muted"
                            }`}
                          >
                            {!s.active && <FaEyeSlash className="h-2.5 w-2.5" />}
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="mt-4 flex gap-2 pt-4 border-t border-cream-200">
                  <AdminButton variant="outline" onClick={() => openEdit(c)}>
                    <FaEdit className="h-3 w-3" /> Edit
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => handleDelete(c)}>
                    <FaTrash className="h-3 w-3 text-red-600" />
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <div className="space-y-5">
          <ImageUploader
            value={form.image ? [form.image] : []}
            onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
            label="Category Image"
          />
          <Field label="Name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Slug" hint="Auto-generated from name if blank">
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Description" required>
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Display Order">
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </Field>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active (visible on storefront)" />
          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Category"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

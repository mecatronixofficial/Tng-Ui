"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaEyeSlash, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";

import { api, type CategoryApi, type SubcategoryApi } from "@/lib/api";
import {
  AdminButton,
  AdminCard,
  EmptyState,
  Field,
  ImageUploader,
  Input,
  Modal,
  Select,
  Toggle,
  toast,
  useConfirm,
} from "@/components/admin/AdminUI";

interface FormState {
  name: string;
  slug: string;
  category: string;
  image: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  category: "",
  image: "",
  order: 0,
  active: true,
};

export default function AdminSubcategoriesPage() {
  const [list, setList] = useState<SubcategoryApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubcategoryApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const categoryName = useMemo(
    () => new Map(categories.map((c) => [c.slug, c.name])),
    [categories],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subs, cats] = await Promise.all([
        api.adminSubcategories(),
        api.adminCategories(),
      ]);
      setList(subs);
      setCategories(cats);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.slug || "" });
    setOpen(true);
  }

  function openEdit(subcategory: SubcategoryApi) {
    setEditing(subcategory);
    setForm({
      name: subcategory.name,
      slug: subcategory.slug,
      category: subcategory.category,
      image: subcategory.image || "",
      order: subcategory.order,
      active: subcategory.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.category) {
      toast("Name and category are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        category: form.category,
        image: form.image || undefined,
        order: Number(form.order),
        active: form.active,
      };

      if (editing) {
        await api.updateSubcategory(editing.id, body);
        toast("Subcategory updated");
      } else {
        await api.createSubcategory(body);
        toast("Subcategory created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(subcategory: SubcategoryApi) {
    confirm(
      `Delete "${subcategory.name}"?`,
      "Products using this subcategory will keep their saved value.",
      async () => {
        try {
          await api.deleteSubcategory(subcategory.id);
          toast("Subcategory deleted");
          await load();
        } catch (e) {
          toast((e as Error).message, "error");
        }
      },
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={openCreate}>
          <FaPlus className="h-3 w-3" /> Add Subcategory
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="grid place-items-center p-16">
          <FaSpinner className="h-7 w-7 animate-spin text-primary-800" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState
          title="No subcategories yet"
          description="Add subcategories under each product category."
          action={
            <AdminButton onClick={openCreate}>
              <FaPlus className="h-3 w-3" /> Add Subcategory
            </AdminButton>
          }
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-[10px] font-semibold uppercase tracking-widest-x text-ink-muted">
                <tr>
                  <th className="px-5 py-3 text-left">Subcategory</th>
                  <th className="px-3 py-3 text-left">Category</th>
                  <th className="px-3 py-3 text-right">Products</th>
                  <th className="px-3 py-3 text-right">Order</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {list.map((subcategory) => (
                  <tr key={subcategory.id} className="hover:bg-cream-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                          {subcategory.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={subcategory.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-widest-x text-ink-muted">
                              Img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{subcategory.name}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-ink-muted">
                            <span>/{subcategory.slug}</span>
                            {!subcategory.active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-0.5 uppercase tracking-wider text-ink-soft">
                                <FaEyeSlash className="h-2.5 w-2.5" /> Hidden
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-ink-soft">
                      {categoryName.get(subcategory.category) || subcategory.category}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-ink">
                      {subcategory.productCount}
                    </td>
                    <td className="px-3 py-3 text-right text-ink-soft">
                      {subcategory.order}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(subcategory)}
                          aria-label="Edit"
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-cream-100 hover:text-primary-800"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subcategory)}
                          aria-label="Delete"
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Subcategory" : "Add Subcategory"}
      >
        <div className="space-y-5">
          <ImageUploader
            value={form.image ? [form.image] : []}
            onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
            label="Subcategory Image"
          />
          <Field label="Name" required>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Cotton Petticoat"
            />
          </Field>
          <Field label="Slug" hint="Auto-generated from name if blank">
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="cotton-petticoat"
            />
          </Field>
          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Display Order">
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <Toggle
            checked={form.active}
            onChange={(active) => setForm({ ...form, active })}
            label="Active (visible on storefront)"
          />
          <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Subcategory"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

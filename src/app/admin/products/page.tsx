"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaStar,
  FaEyeSlash,
} from "react-icons/fa";

import {
  api,
  ProductApi,
  CategoryApi,
  SubcategoryApi,
  Paginated,
} from "@/lib/api";
import {
  AdminButton,
  AdminCard,
  Field,
  Input,
  Modal,
  Select,
  TextArea,
  Toggle,
  ImageUploader,
  EmptyState,
  toast,
  useConfirm,
} from "@/components/admin/AdminUI";
import { cn } from "@/utils";

interface FormState {
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  images: string[];
  description: string;
  clothType: string;
  colors: string;       // comma-separated in form
  sizes: string;        // comma-separated in form
  stock: number;
  offerPrice: number;
  originalPrice: number;
  material: string;
  gsm: string;
  pattern: string;
  tags: string;         // comma-separated in form
  washable: boolean;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  rating: number;
  reviews: number;
}

const emptyForm: FormState = {
  name: "", slug: "", category: "", subcategory: "",
  images: [], description: "", clothType: "",
  colors: "", sizes: "",
  stock: 0, offerPrice: 0, originalPrice: 0,
  material: "", gsm: "", pattern: "", tags: "",
  washable: true, featured: false, newArrival: false, active: true,
  rating: 4.5, reviews: 0,
};

export default function AdminProductsPage() {
  const [list, setList] = useState<Paginated<ProductApi> | null>(null);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProductApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      const [products, cats, subs] = await Promise.all([
        api.adminProducts(params.toString()),
        api.adminCategories(),
        api.adminSubcategories(),
      ]);
      setList(products);
      setCategories(cats);
      setSubcategories(subs);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search, load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.slug || "", subcategory: "" });
    setOpen(true);
  }

  function openEdit(p: ProductApi) {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory || "",
      images: p.images,
      description: p.description,
      clothType: p.clothType,
      colors: p.colors.join(", "),
      sizes: p.sizes.join(", "),
      stock: p.stock,
      offerPrice: p.offerPrice,
      originalPrice: p.originalPrice,
      material: p.material,
      gsm: p.gsm || "",
      pattern: p.pattern || "",
      tags: p.tags.join(", "),
      washable: p.washable,
      featured: p.featured,
      newArrival: p.newArrival,
      active: p.active,
      rating: p.rating,
      reviews: p.reviews,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.category || !form.description || !form.material || !form.clothType) {
      toast("Name, category, description, material and cloth type are required.", "error");
      return;
    }
    if (form.images.length === 0) {
      toast("At least one image is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        category: form.category,
        subcategory: form.subcategory,
        images: form.images,
        description: form.description,
        clothType: form.clothType,
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        stock: Number(form.stock),
        offerPrice: Number(form.offerPrice),
        originalPrice: Number(form.originalPrice),
        material: form.material,
        gsm: form.gsm || undefined,
        pattern: form.pattern || undefined,
        washable: form.washable,
        featured: form.featured,
        newArrival: form.newArrival,
        active: form.active,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
      };

      if (editing) {
        await api.updateProduct(editing.id, body);
        toast("Product updated");
      } else {
        await api.createProduct(body);
        toast("Product created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(p: ProductApi) {
    confirm(`Delete "${p.name}"?`, "This cannot be undone.", async () => {
      try {
        await api.deleteProduct(p.id);
        toast("Product deleted");
        await load();
      } catch (e) {
        toast((e as Error).message, "error");
      }
    });
  }

  const availableSubcategories = subcategories.filter((s) => s.category === form.category);
  const subcategoryNameByValue = new Map(
    subcategories.flatMap((s) => [
      [s.slug, s.name],
      [s.name, s.name],
    ]),
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
        <div className="relative max-w-md flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, tag, material..."
            className="!pl-9"
          />
        </div>
        <AdminButton onClick={openCreate}>
          <FaPlus className="h-3 w-3" /> Add Product
        </AdminButton>
      </div>

      {/* List */}
      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : !list || list.data.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to get started."
          action={<AdminButton onClick={openCreate}><FaPlus className="h-3 w-3" /> Add Product</AdminButton>}
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-[10px] uppercase tracking-widest-x text-ink-muted font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-3 py-3">Category</th>
                  <th className="text-right px-3 py-3">Stock</th>
                  <th className="text-center px-3 py-3">Flags</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {list.data.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                          {p.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-ink truncate">{p.name}</div>
                          <div className="text-[10px] text-ink-muted truncate">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-ink-soft capitalize">
                      <div>{p.category.replace("-", " ")}</div>
                      {p.subcategory && (
                        <div className="mt-0.5 text-[10px] normal-case text-ink-muted">
                          {subcategoryNameByValue.get(p.subcategory) || p.subcategory}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={cn(
                          "font-semibold",
                          p.stock === 0 ? "text-red-600" : p.stock < 20 ? "text-amber-600" : "text-ink",
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        {p.featured && <FaStar className="h-3 w-3 text-secondary" title="Featured" />}
                        {p.newArrival && (
                          <span className="rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold">
                            New
                          </span>
                        )}
                        {!p.active && <FaEyeSlash className="h-3 w-3 text-ink-muted" title="Inactive" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label="Edit"
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-cream-100 hover:text-primary-800"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
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
          <div className="px-5 py-3 text-xs text-ink-muted border-t border-cream-200">
            {list.meta.total} {list.meta.total === 1 ? "product" : "products"} total
          </div>
        </AdminCard>
      )}

      {/* Form modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-5">
          <ImageUploader
            value={form.images}
            onChange={(images) => setForm({ ...form, images })}
            multiple
            label="Product Images (first one is the main image)"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Premium Cotton Petticoat"
              />
            </Field>
            <Field label="Slug" hint="Auto-generated from name if blank">
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="premium-cotton-petticoat"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Subcategory">
              <Select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                disabled={!form.category}
              >
                <option value="">Select subcategory...</option>
                {form.subcategory &&
                  !availableSubcategories.some((s) => s.slug === form.subcategory || s.name === form.subcategory) && (
                    <option value={form.subcategory}>{form.subcategory}</option>
                  )}
                {availableSubcategories.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Description" required>
            <TextArea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A detailed description of the product..."
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Cloth Type" required>
              <Input
                value={form.clothType}
                onChange={(e) => setForm({ ...form, clothType: e.target.value })}
                placeholder="Cotton"
              />
            </Field>
            <Field label="Material" required>
              <Input
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="100% Pure Cotton"
              />
            </Field>
            <Field label="GSM">
              <Input
                value={form.gsm}
                onChange={(e) => setForm({ ...form, gsm: e.target.value })}
                placeholder="150 GSM"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Colors" hint="Comma-separated (White, Maroon, Black)">
              <Input
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="White, Maroon, Black"
              />
            </Field>
            <Field label="Sizes" hint="Comma-separated (S, M, L, XL)">
              <Input
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="S, M, L, XL"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Stock">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                min={0}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Pattern">
              <Input
                value={form.pattern}
                onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                placeholder="Solid / Checks / Border"
              />
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="cotton, daily-wear"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Rating (0-5)">
              <Input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
            </Field>
            <Field label="Review Count">
              <Input
                type="number"
                min={0}
                value={form.reviews}
                onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-cream-200">
            <Toggle
              checked={form.active}
              onChange={(v) => setForm({ ...form, active: v })}
              label="Active (visible on storefront)"
            />
            <Toggle
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
              label="Featured"
            />
            <Toggle
              checked={form.newArrival}
              onChange={(v) => setForm({ ...form, newArrival: v })}
              label="New Arrival"
            />
            <Toggle
              checked={form.washable}
              onChange={(v) => setForm({ ...form, washable: v })}
              label="Washable"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create Product"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

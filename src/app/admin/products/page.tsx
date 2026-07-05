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
  FaFileImport,
  FaDownload,
} from "react-icons/fa";

import {
  api,
  ProductApi,
  CategoryApi,
  SubcategoryApi,
  Paginated,
  BulkProductImportResult,
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
  material: string;
  gsm: string;
  pattern: string;
  tags: string;         // comma-separated in form
  washable: boolean;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  retailEnabled: boolean;
  wholesaleEnabled: boolean;
  bundleSize: number;
  allowMixedColors: boolean;
  allowMixedSizes: boolean;
  rating: number;
  reviews: number;
}

const emptyForm: FormState = {
  name: "", slug: "", category: "", subcategory: "",
  images: [], description: "", clothType: "",
  colors: "", sizes: "",
  stock: 0,
  material: "", gsm: "", pattern: "", tags: "",
  washable: true, featured: false, newArrival: false, active: true,
  retailEnabled: true, wholesaleEnabled: true, bundleSize: 12,
  allowMixedColors: false, allowMixedSizes: false,
  rating: 4.5, reviews: 0,
};

const bulkTemplate = [
  [
    "name", "slug", "category", "subcategory", "images", "description",
    "clothType", "colors", "sizes", "stock",
    "material", "gsm", "pattern", "tags", "retailEnabled",
    "wholesaleEnabled", "bundleSize", "allowMixedColors", "allowMixedSizes",
    "featured", "newArrival", "active",
  ],
  [
    "Premium Cotton Petticoat", "premium-cotton-petticoat", "petticoats", "",
    "https://example.com/image-1.jpg | https://example.com/image-2.jpg",
    "Soft cotton petticoat for daily wear", "Cotton", "White | Maroon | Black",
    "S | M | L | XL", "100", "100% Pure Cotton", "150 GSM",
    "Solid", "cotton | daily-wear", "true", "true", "12", "false", "false",
    "false", "true", "true",
  ],
]
  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  .join("\n");

const bulkTemplateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(bulkTemplate)}`;

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, i) => [header, values[i]?.trim() || ""])),
  );
}

function getCell(row: Record<string, string>, names: string[]) {
  for (const name of names) {
    const value = row[normalizeHeader(name)];
    if (value) return value;
  }
  return "";
}

function splitList(value: string) {
  return value
    .split(/[|;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBool(value: string, fallback = false) {
  if (!value) return fallback;
  return ["1", "true", "yes", "y", "active"].includes(value.trim().toLowerCase());
}

function toNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildBulkProducts(csvText: string) {
  return parseCsv(csvText).map((row) => {
    const name = getCell(row, ["name", "product name", "product"]);
    return {
      name,
      slug: getCell(row, ["slug"]),
      category: getCell(row, ["category", "category slug"]),
      subcategory: getCell(row, ["subcategory", "sub category", "subcategory slug"]),
      images: splitList(getCell(row, ["images", "image", "image url", "image urls"])),
      description: getCell(row, ["description", "details"]) || name,
      clothType: getCell(row, ["clothType", "cloth type", "type"]) || "Cotton",
      colors: splitList(getCell(row, ["colors", "colour", "color"])),
      sizes: splitList(getCell(row, ["sizes", "size"])),
      stock: toNumber(getCell(row, ["stock", "qty", "quantity"])),
      material: getCell(row, ["material", "fabric"]) || "Cotton",
      gsm: getCell(row, ["gsm"]),
      pattern: getCell(row, ["pattern", "design"]),
      tags: splitList(getCell(row, ["tags", "tag"])),
      retailEnabled: toBool(getCell(row, ["retailEnabled", "retail"]), true),
      wholesaleEnabled: toBool(getCell(row, ["wholesaleEnabled", "wholesale", "bulk"]), true),
      bundleSize: toNumber(getCell(row, ["bundleSize", "bundle size", "bundle qty"]), 12),
      allowMixedColors: toBool(getCell(row, ["allowMixedColors", "mixed colors"])),
      allowMixedSizes: toBool(getCell(row, ["allowMixedSizes", "mixed sizes"])),
      washable: toBool(getCell(row, ["washable"]), true),
      featured: toBool(getCell(row, ["featured"])),
      newArrival: toBool(getCell(row, ["newArrival", "new arrival", "new"])),
      active: toBool(getCell(row, ["active", "status"]), true),
      rating: toNumber(getCell(row, ["rating"]), 4.5),
      reviews: toNumber(getCell(row, ["reviews", "review count"])),
    };
  });
}

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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkCsv, setBulkCsv] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(true);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkProductImportResult | null>(null);
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

  function openBulkUpload() {
    setBulkCsv("");
    setBulkResult(null);
    setBulkUpdating(true);
    setBulkOpen(true);
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
      material: p.material,
      gsm: p.gsm || "",
      pattern: p.pattern || "",
      tags: p.tags.join(", "),
      washable: p.washable,
      featured: p.featured,
      newArrival: p.newArrival,
      active: p.active,
      retailEnabled: p.retailEnabled ?? true,
      wholesaleEnabled: p.wholesaleEnabled ?? true,
      bundleSize: p.bundleSize ?? 12,
      allowMixedColors: p.allowMixedColors ?? false,
      allowMixedSizes: p.allowMixedSizes ?? false,
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
    if (!form.retailEnabled && !form.wholesaleEnabled) {
      toast("Enable retail, wholesale, or both for this product.", "error");
      return;
    }
    if (form.wholesaleEnabled && Number(form.bundleSize) < 1) {
      toast("Bulk bundle quantity must be at least 1 piece.", "error");
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
        material: form.material,
        gsm: form.gsm || undefined,
        pattern: form.pattern || undefined,
        washable: form.washable,
        featured: form.featured,
        newArrival: form.newArrival,
        active: form.active,
        retailEnabled: form.retailEnabled,
        wholesaleEnabled: form.wholesaleEnabled,
        bundleSize: Number(form.bundleSize),
        allowMixedColors: form.wholesaleEnabled && form.allowMixedColors,
        allowMixedSizes: form.wholesaleEnabled && form.allowMixedSizes,
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

  async function handleBulkFile(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast("Please export your Excel sheet as CSV, then upload the CSV file.", "error");
      return;
    }
    setBulkCsv(await file.text());
    setBulkResult(null);
  }

  async function handleBulkImport() {
    const products = buildBulkProducts(bulkCsv);
    if (products.length === 0) {
      toast("No product rows found in the CSV file.", "error");
      return;
    }

    const missing = products.findIndex((p) => !p.name || !p.category);
    if (missing >= 0) {
      toast(`Row ${missing + 2} needs at least product name and category.`, "error");
      return;
    }

    setBulkImporting(true);
    try {
      const result = await api.bulkProducts({
        products,
        updateExisting: bulkUpdating,
      });
      setBulkResult(result);
      toast(`Bulk import complete: ${result.created} created, ${result.updated} updated.`);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBulkImporting(false);
    }
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <AdminButton variant="outline" onClick={openBulkUpload}>
            <FaFileImport className="h-3 w-3" /> Bulk Upload
          </AdminButton>
          <AdminButton onClick={openCreate}>
            <FaPlus className="h-3 w-3" /> Add Product
          </AdminButton>
        </div>
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

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Stock">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                min={0}
              />
            </Field>
            <Field label="Bulk Bundle Qty" hint="Pieces per bundle">
              <Input
                type="number"
                value={form.bundleSize}
                onChange={(e) => setForm({ ...form, bundleSize: Number(e.target.value) })}
                min={1}
                disabled={!form.wholesaleEnabled}
              />
            </Field>
          </div>

          <div className="rounded-lg border border-cream-200 bg-cream-50 p-4">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
              Retail and Bulk Options
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle
                checked={form.retailEnabled}
                onChange={(v) => setForm({ ...form, retailEnabled: v })}
                label="Enable retail quantity"
              />
              <Toggle
                checked={form.wholesaleEnabled}
                onChange={(v) =>
                  setForm({
                    ...form,
                    wholesaleEnabled: v,
                    allowMixedColors: v ? form.allowMixedColors : false,
                    allowMixedSizes: v ? form.allowMixedSizes : false,
                  })
                }
                label="Enable bulk bundles"
              />
              <Toggle
                checked={form.allowMixedColors}
                onChange={(v) => setForm({ ...form, allowMixedColors: v })}
                label="Allow mixed colors in bulk"
                disabled={!form.wholesaleEnabled}
              />
              <Toggle
                checked={form.allowMixedSizes}
                onChange={(v) => setForm({ ...form, allowMixedSizes: v })}
                label="Allow mixed sizes in bulk"
                disabled={!form.wholesaleEnabled}
              />
            </div>
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

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Upload Products"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-5">
          <div className="rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm leading-6 text-ink-soft">
            Upload products from a CSV file exported from Excel. Keep the first row as column
            names. Required columns: <strong>name</strong> and <strong>category</strong>.
            Recommended columns: images, description, clothType, colors, sizes, stock,
            material, gsm, pattern and tags.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={bulkTemplateHref}
              download="product-bulk-template.csv"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-3 text-sm font-bold text-primary-800 transition hover:border-secondary hover:text-secondary"
            >
              <FaDownload className="h-3.5 w-3.5" />
              Download CSV Template
            </a>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary">
              <FaFileImport className="h-3.5 w-3.5" />
              Choose CSV File
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => handleBulkFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <Field
            label="CSV Preview / Paste CSV"
            hint="List values can use |, ;, or comma inside a cell. Example: White | Maroon | Black"
          >
            <TextArea
              rows={9}
              value={bulkCsv}
              onChange={(e) => {
                setBulkCsv(e.target.value);
                setBulkResult(null);
              }}
              placeholder="Paste CSV here or choose a CSV file..."
              className="font-mono text-xs"
            />
          </Field>

          <div className="grid gap-3 rounded-lg border border-cream-200 bg-cream-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <Toggle
              checked={bulkUpdating}
              onChange={setBulkUpdating}
              label="Update existing products with same slug"
            />
            <div className="text-xs font-semibold text-ink-muted">
              {buildBulkProducts(bulkCsv).length} rows ready
            </div>
          </div>

          {bulkResult && (
            <div className="rounded-lg border border-secondary/30 bg-white p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-4">
                <div><strong>{bulkResult.created}</strong><br />Created</div>
                <div><strong>{bulkResult.updated}</strong><br />Updated</div>
                <div><strong>{bulkResult.skipped}</strong><br />Skipped</div>
                <div><strong>{bulkResult.errors.length}</strong><br />Errors</div>
              </div>
              {bulkResult.errors.length > 0 && (
                <div className="mt-4 max-h-40 overflow-auto rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {bulkResult.errors.slice(0, 20).map((error) => (
                    <div key={`${error.row}-${error.message}`}>
                      Row {error.row}: {error.name ? `${error.name} - ` : ""}{error.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
            <AdminButton variant="ghost" onClick={() => setBulkOpen(false)}>
              Close
            </AdminButton>
            <AdminButton onClick={handleBulkImport} loading={bulkImporting}>
              Import Products
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

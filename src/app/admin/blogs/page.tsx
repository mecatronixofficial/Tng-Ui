"use client";

import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaStar, FaEyeSlash } from "react-icons/fa";

import { api, BlogApi, Paginated } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, ImageUploader,
  Input, Modal, TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";
import { cn } from "@/utils";

interface FormState {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; author: string; authorImage: string; category: string; tags: string;
  readTime: number; featured: boolean; published: boolean;
}

const emptyForm: FormState = {
  title: "", slug: "", excerpt: "", content: "",
  coverImage: "", author: "", authorImage: "", category: "", tags: "",
  readTime: 5, featured: false, published: true,
};

export default function AdminBlogsPage() {
  const [list, setList] = useState<Paginated<BlogApi> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await api.adminBlogs("limit=100"));
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

  function openEdit(b: BlogApi) {
    setEditing(b);
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content,
      coverImage: b.coverImage, author: b.author, authorImage: b.authorImage || "", category: b.category,
      tags: b.tags.join(", "), readTime: b.readTime,
      featured: b.featured, published: b.published,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.excerpt || !form.content || !form.coverImage || !form.author || !form.category) {
      toast("Title, excerpt, content, cover image, author and category are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        author: form.author,
        authorImage: form.authorImage || undefined,
        category: form.category,
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        readTime: Number(form.readTime),
        featured: form.featured,
        published: form.published,
      };
      if (editing) {
        await api.updateBlog(editing.id, body);
        toast("Article updated");
      } else {
        await api.createBlog(body);
        toast("Article created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(b: BlogApi) {
    confirm(`Delete "${b.title}"?`, "This cannot be undone.", async () => {
      try {
        await api.deleteBlog(b.id);
        toast("Article deleted");
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
          <FaPlus className="h-3 w-3" /> New Article
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : !list || list.data.length === 0 ? (
        <EmptyState
          title="No articles yet"
          description="Write your first blog post to share insights with your customers."
          action={<AdminButton onClick={openCreate}><FaPlus className="h-3 w-3" /> New Article</AdminButton>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.data.map((b) => (
            <AdminCard key={b.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.coverImage} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {b.featured && (
                    <span className="rounded-full bg-secondary text-cream-50 px-2.5 py-1 text-[9px] uppercase tracking-widest-x font-bold flex items-center gap-1">
                      <FaStar className="h-2.5 w-2.5" /> Featured
                    </span>
                  )}
                  {!b.published && (
                    <span className="rounded-full bg-ink/80 text-cream-50 px-2.5 py-1 text-[9px] uppercase tracking-widest-x font-bold flex items-center gap-1">
                      <FaEyeSlash className="h-2.5 w-2.5" /> Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-widest-x text-secondary-dark font-semibold">
                  {b.category} · {b.readTime} min read
                </div>
                <h3 className="display text-lg font-semibold text-primary-950 mt-2 leading-tight line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-sm text-ink-soft mt-2 line-clamp-2 flex-1">{b.excerpt}</p>
                <div className="text-xs text-ink-muted mt-3">
                  by {b.author} · {moment(b.publishedAt).format("MMM D, YYYY")}
                </div>
                <div className="mt-4 flex gap-2 pt-4 border-t border-cream-200">
                  <AdminButton variant="outline" onClick={() => openEdit(b)}>
                    <FaEdit className="h-3 w-3" /> Edit
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => handleDelete(b)}>
                    <FaTrash className="h-3 w-3 text-red-600" />
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Article" : "New Article"}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-5">
          <ImageUploader
            value={form.coverImage ? [form.coverImage] : []}
            onChange={(urls) => setForm({ ...form, coverImage: urls[0] || "" })}
            label="Cover Image"
          />

          <ImageUploader
            value={form.authorImage ? [form.authorImage] : []}
            onChange={(urls) => setForm({ ...form, authorImage: urls[0] || "" })}
            label="Author Image"
          />

          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" hint="Auto-generated from title if blank">
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
            <Field label="Category" required>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Guides / Industry / Care Guide" />
            </Field>
          </div>

          <Field label="Excerpt" required hint="Short summary shown in the listing">
            <TextArea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </Field>

          <Field label="Content" required hint="Use blank lines between paragraphs">
            <TextArea
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your article here. Separate paragraphs with blank lines."
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Author" required>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
            <Field label="Read Time (min)">
              <Input type="number" value={form.readTime} min={1} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })} />
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="cotton, care" />
            </Field>
          </div>

          <div className="flex gap-6 pt-2 border-t border-cream-200">
            <Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Published" />
            <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Publish Article"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

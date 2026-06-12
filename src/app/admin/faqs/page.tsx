"use client";

import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";

import { api, FaqApi } from "@/lib/api";
import {
  AdminButton, AdminCard, EmptyState, Field, Input, Modal,
  TextArea, Toggle, toast, useConfirm,
} from "@/components/admin/AdminUI";

interface FormState {
  question: string;
  answer: string;
  active: boolean;
  order: number;
}

const emptyForm: FormState = {
  question: "", answer: "", active: true, order: 0,
};

export default function AdminFaqsPage() {
  const [list, setList] = useState<FaqApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqApi | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await api.adminFaqs());
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

  function openEdit(f: FaqApi) {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, active: f.active, order: f.order });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.question || !form.answer) {
      toast("Question and answer are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        question: form.question,
        answer: form.answer,
        active: form.active,
        order: Number(form.order),
      };
      if (editing) {
        await api.updateFaq(editing.id, body);
        toast("FAQ updated");
      } else {
        await api.createFaq(body);
        toast("FAQ added");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(f: FaqApi) {
    confirm(`Delete "${f.question}"?`, "This cannot be undone.", async () => {
      try {
        await api.deleteFaq(f.id);
        toast("FAQ deleted");
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
          <FaPlus className="h-3 w-3" /> Add FAQ
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : list.length === 0 ? (
        <EmptyState title="No FAQs yet" description="Add frequently asked questions to help customers." />
      ) : (
        <div className="space-y-3">
          {list.map((f) => (
            <AdminCard key={f.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!f.active && (
                      <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold">
                        Hidden
                      </span>
                    )}
                    <span className="text-xs text-ink-muted">#{f.order}</span>
                  </div>
                  <p className="font-semibold text-ink leading-snug">{f.question}</p>
                  <p className="text-sm text-ink-soft mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(f)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-cream-100 hover:text-primary-800"
                    aria-label="Edit"
                  >
                    <FaEdit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit FAQ" : "Add FAQ"}>
        <div className="space-y-5">
          <Field label="Question" required>
            <Input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Do you offer wholesale supply?"
            />
          </Field>
          <Field label="Answer" required>
            <TextArea
              rows={5}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </Field>
          <Field label="Display Order">
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <div className="pt-2 border-t border-cream-200">
            <Toggle
              checked={form.active}
              onChange={(v) => setForm({ ...form, active: v })}
              label="Active (visible on site)"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Create FAQ"}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {dialog}
    </div>
  );
}

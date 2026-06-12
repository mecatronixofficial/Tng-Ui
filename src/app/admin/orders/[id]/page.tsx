"use client";

import { useCallback, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import {
  FaSpinner,
  FaArrowLeft,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaTrash,
} from "react-icons/fa";

import { api, OrderApi, OrderStatus } from "@/lib/api";
import {
  AdminButton, AdminCard, Field, Select, TextArea, toast, useConfirm,
} from "@/components/admin/AdminUI";
import { buildWhatsAppEnquiryUrl } from "@/lib/whatsapp";
import { cn } from "@/utils";

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
  { value: "quoted", label: "Quoted", color: "bg-purple-100 text-purple-700" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-700" },
  { value: "despatched", label: "Despatched", color: "bg-indigo-100 text-indigo-700" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("new");
  const [notes, setNotes] = useState("");
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const o = await api.adminOrderById(id);
      setOrder(o);
      setStatus(o.status);
      setNotes(o.adminNotes || "");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    try {
      const updated = await api.updateOrder(id, { status, adminNotes: notes });
      setOrder(updated);
      toast("Order updated");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    confirm("Delete this order?", "This cannot be undone.", async () => {
      try {
        await api.deleteOrder(id);
        toast("Order deleted");
        router.push("/admin/orders");
      } catch (e) {
        toast((e as Error).message, "error");
      }
    });
  }

  if (loading) {
    return (
      <AdminCard className="p-16 grid place-items-center">
        <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
      </AdminCard>
    );
  }

  if (!order) {
    return (
      <AdminCard className="p-12 text-center">
        <h3 className="display text-xl">Order not found</h3>
        <Link href="/admin/orders" className="text-primary-800 underline mt-3 inline-block">
          ← Back to orders
        </Link>
      </AdminCard>
    );
  }

  const whatsappReply = `https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello ${order.customerName}, thank you for your enquiry with Thangavel Textile.`,
  )}`;

  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider-x font-semibold text-primary-800 hover:text-secondary-dark"
      >
        <FaArrowLeft className="h-3 w-3" /> Back to orders
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-[10px] uppercase tracking-widest-x text-ink-muted font-semibold">
                  Order from {moment(order.createdAt).format("MMM D, YYYY · h:mm A")}
                </div>
                <h2 className="display text-2xl font-semibold text-primary-950 mt-1">
                  {order.customerName}
                </h2>
              </div>
              <span className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-widest-x font-bold",
                statusOptions.find((s) => s.value === order.status)?.color,
              )}>
                {order.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <a href={`tel:${order.phone}`} className="flex items-center gap-3 rounded-lg bg-cream-100 p-3 hover:bg-cream-200 transition">
                <FaPhone className="h-4 w-4 text-primary-800" />
                <span className="text-sm font-medium text-ink">{order.phone}</span>
              </a>
              {order.email && (
                <a href={`mailto:${order.email}`} className="flex items-center gap-3 rounded-lg bg-cream-100 p-3 hover:bg-cream-200 transition">
                  <FaEnvelope className="h-4 w-4 text-primary-800" />
                  <span className="text-sm font-medium text-ink truncate">{order.email}</span>
                </a>
              )}
            </div>

            <a href={whatsappReply} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] text-white py-3 text-sm font-semibold hover:bg-[#1ea952] transition">
              <FaWhatsapp className="h-4 w-4" /> Reply on WhatsApp
            </a>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="display text-xl font-semibold text-primary-950 mb-4">
              Message
            </h3>
            <p className="text-ink-soft leading-relaxed whitespace-pre-line">{order.message}</p>
          </AdminCard>

          {(order.productName || order.color || order.size) && (
            <AdminCard className="p-6">
              <h3 className="display text-xl font-semibold text-primary-950 mb-4">
                Product Details
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                {order.productName && (
                  <>
                    <dt className="text-ink-muted">Product</dt>
                    <dd className="font-medium">
                      {order.productSlug ? (
                        <Link href={`/products/${order.productSlug}`} target="_blank" className="text-primary-800 hover:underline">
                          {order.productName}
                        </Link>
                      ) : (
                        order.productName
                      )}
                    </dd>
                  </>
                )}
                {order.color && (<><dt className="text-ink-muted">Color</dt><dd className="font-medium">{order.color}</dd></>)}
                {order.size && (<><dt className="text-ink-muted">Size</dt><dd className="font-medium">{order.size}</dd></>)}
                <dt className="text-ink-muted">Quantity</dt><dd className="font-medium">{order.quantity}</dd>
              </dl>
            </AdminCard>
          )}
        </div>

        {/* Workflow sidebar */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="display text-xl font-semibold text-primary-950 mb-5">
              Workflow
            </h3>

            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </Field>

            <div className="mt-5">
              <Field label="Internal Notes" hint="Visible to admins only">
                <TextArea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about quotation, despatch tracking, customer preferences..."
                />
              </Field>
            </div>

            <div className="mt-5 space-y-2">
              <AdminButton onClick={save} loading={saving} className="w-full">
                Save Changes
              </AdminButton>
              <AdminButton variant="ghost" onClick={handleDelete} className="w-full !text-red-600">
                <FaTrash className="h-3 w-3" /> Delete Order
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <div className="text-[10px] uppercase tracking-widest-x text-ink-muted font-semibold mb-3">
              Metadata
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between"><dt className="text-ink-muted">Source</dt><dd className="font-medium capitalize">{order.source.replace("_", " ")}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Order ID</dt><dd className="font-mono text-[10px]">{order.id.slice(-8)}</dd></div>
            </dl>
          </AdminCard>
        </div>
      </div>

      {dialog}
    </div>
  );
}

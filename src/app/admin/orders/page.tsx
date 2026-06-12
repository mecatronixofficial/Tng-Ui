"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { FaSpinner, FaSearch, FaInbox } from "react-icons/fa";

import { api, OrderApi, OrderStatus, Paginated } from "@/lib/api";
import { AdminCard, EmptyState, Input, Select, toast } from "@/components/admin/AdminUI";
import { cn } from "@/utils";

const statusBadgeColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  confirmed: "bg-green-100 text-green-700",
  despatched: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [list, setList] = useState<Paginated<OrderApi> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      setList(await api.adminOrders(params.toString()));
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, product..."
            className="!pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "")}
          className="sm:w-48"
        >
          <option value="">All statuses</option>
          {Object.keys(statusBadgeColor).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <AdminCard className="p-16 grid place-items-center">
          <FaSpinner className="h-7 w-7 text-primary-800 animate-spin" />
        </AdminCard>
      ) : !list || list.data.length === 0 ? (
        <EmptyState
          title="No orders match"
          description={search || status ? "Try removing a filter." : "New enquiries from the contact form and product pages will appear here."}
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-[10px] uppercase tracking-widest-x text-ink-muted font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-3 py-3">Product</th>
                  <th className="text-left px-3 py-3">Source</th>
                  <th className="text-left px-3 py-3">Status</th>
                  <th className="text-right px-5 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {list.data.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-cream-50 cursor-pointer"
                    onClick={() => (window.location.href = `/admin/orders/${o.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-semibold text-ink">{o.customerName}</div>
                      <div className="text-xs text-ink-muted">{o.phone}{o.email && ` · ${o.email}`}</div>
                    </td>
                    <td className="px-3 py-3 max-w-xs">
                      <div className="text-ink-soft truncate">
                        {o.productName || <span className="italic text-ink-muted">General enquiry</span>}
                      </div>
                      {(o.color || o.size || o.quantity > 1) && (
                        <div className="text-[10px] text-ink-muted">
                          {[o.color, o.size, o.quantity > 1 ? `Qty: ${o.quantity}` : null].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-ink-muted text-xs capitalize">
                      {o.source.replace("_", " ")}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-widest-x font-bold",
                        statusBadgeColor[o.status],
                      )}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-ink-muted whitespace-nowrap">
                      {moment(o.createdAt).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 text-xs text-ink-muted border-t border-cream-200 flex items-center justify-between">
            <span>{list.meta.total} {list.meta.total === 1 ? "order" : "orders"} total</span>
            <span className="flex items-center gap-2"><FaInbox className="h-3 w-3" /> Live inbox</span>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

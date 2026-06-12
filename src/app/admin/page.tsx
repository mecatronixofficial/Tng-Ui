"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import {
  FaBoxOpen,
  FaInbox,
  FaBlog,
  FaTags,
  FaExclamationTriangle,
  FaCheckCircle,
  FaStar,
  FaBullhorn,
  FaPercent,
  FaQuestionCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaUser,
  FaChartBar,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { api, DashboardStats, OrderApi } from "@/lib/api";
import { AdminCard, StatTile, AdminButton } from "@/components/admin/AdminUI";
import { cn } from "@/utils";

/* ─── constants ───────────────────────────────────────────────── */

const QUOTES = [
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your brand is what people say when you're not in the room.", author: "Jeff Bezos" },
  { text: "A satisfied customer is the best business strategy.", author: "Michael LeBoeuf" },
  { text: "Details make perfection, and perfection is not a detail.", author: "Leonardo da Vinci" },
  { text: "Excellence is not a skill. It is an attitude.", author: "Ralph Marston" },
  { text: "Great things are not done by impulse, but by a series of small things.", author: "Vincent van Gogh" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  quoted: "#8b5cf6",
  confirmed: "#22c55e",
  despatched: "#6366f1",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const statusBadgeColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  confirmed: "bg-green-100 text-green-700",
  despatched: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const sourceBadgeColor: Record<string, string> = {
  contact_form: "bg-sky-100 text-sky-700",
  product_enquiry: "bg-violet-100 text-violet-700",
  whatsapp: "bg-green-100 text-green-700",
  wholesale: "bg-primary-100 text-primary-700",
};

const BRAND_PRIMARY = "rgb(var(--color-primary-600))";
const CHART_GRID = "#ffedd5";
const CHART_BORDER = "#fed7aa";
const CHART_MUTED = "#fb923c";
const SOURCE_COLORS = ["#7c3aed", "#2563eb", "#16a34a", BRAND_PRIMARY];

const sourceLabel: Record<string, string> = {
  contact_form: "Contact Form",
  product_enquiry: "Product Enquiry",
  whatsapp: "WhatsApp",
  wholesale: "Wholesale",
};

/* ─── helpers ─────────────────────────────────────────────────── */

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function sourceCounts(orders: OrderApi[]) {
  const counts: Record<string, number> = {};
  for (const o of orders) counts[o.source] = (counts[o.source] || 0) + 1;
  return counts;
}

/* ─── mini live clock ─────────────────────────────────────────── */

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right shrink-0 hidden sm:block">
      <div className="display text-2xl font-semibold text-white tabular-nums">
        {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-xs text-ink-muted mt-0.5">
        {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.stats(),
      api.adminTestimonials().then((list) => list.filter((t) => !t.approved).length).catch(() => 0),
    ])
      .then(([s, pending]) => {
        if (!cancelled) { setStats(s); setPendingTestimonials(pending); }
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  /* ── skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl shimmer" />
          <div className="h-72 rounded-2xl shimmer" />
        </div>
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    );
  }

  /* ── error ── */
  if (error || !stats) {
    return (
      <AdminCard className="p-8 text-center">
        <FaExclamationTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
        <h3 className="display text-xl text-white">Couldn't load dashboard</h3>
        <p className="text-ink-muted text-sm mt-2">{error || "Unknown error"}</p>
        <p className="text-ink-muted text-xs mt-4">
          Check that the backend is running at{" "}
          <code>{process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}</code>.
        </p>
      </AdminCard>
    );
  }

  /* ── derived chart data ── */

  // Order status pie
  const orderStatusData = Object.entries(stats.orders.byStatus)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k, value: v }));

  // Product breakdown bar
  const productBarData = [
    {
      name: "Products",
      Active: stats.products.active,
      "Out of Stock": stats.products.outOfStock,
      Inactive: stats.products.total - stats.products.active - stats.products.outOfStock,
    },
  ];

  // Blog breakdown bar
  const blogBarData = [
    {
      name: "Blog",
      Published: stats.blogs.published,
      Drafts: stats.blogs.total - stats.blogs.published,
    },
  ];

  // Source pie
  const raw = sourceCounts(stats.recentOrders);
  const sourcePieData = Object.entries(raw).map(([k, v]) => ({
    name: sourceLabel[k] || k,
    value: v,
  }));

  // Attention alerts
  const alerts: { label: string; href: string; color: string }[] = [];
  if (stats.orders.new > 0)
    alerts.push({ label: `${stats.orders.new} new enquir${stats.orders.new === 1 ? "y" : "ies"} waiting`, href: "/admin/orders", color: "border-blue-400 bg-blue-50 text-blue-800" });
  if (stats.products.outOfStock > 0)
    alerts.push({ label: `${stats.products.outOfStock} product${stats.products.outOfStock === 1 ? "" : "s"} out of stock`, href: "/admin/products", color: "border-red-400 bg-red-50 text-red-800" });
  if (pendingTestimonials > 0)
    alerts.push({ label: `${pendingTestimonials} review${pendingTestimonials === 1 ? "" : "s"} pending approval`, href: "/admin/testimonials", color: "border-amber-400 bg-amber-50 text-amber-800" });

  return (
    <div className="space-y-8 ">

      {/* ── Welcome header ──────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 px-8 py-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-secondary text-sm font-semibold uppercase tracking-widest-x mb-1">
            Jai India Enterprises — Admin
          </p>
          <h1 className="display text-2xl md:text-3xl font-bold text-cream-50">
            {greet()}, Welcome back
          </h1>
          <p className="text-cream-200 text-sm mt-2 italic">
            &ldquo;{quote.text}&rdquo;
            <span className="not-italic text-cream-300 ml-1">— {quote.author}</span>
          </p>
        </div>
        <LiveClock />
      </div>

      {/* ── Stat tiles ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatTile label="New Enquiries" value={stats.orders.new} hint="awaiting response" accent="secondary" />
        <StatTile label="This Week" value={stats.orders.last7Days} hint="orders in 7 days" />
        <StatTile label="Total Orders" value={stats.orders.total} hint={`${stats.orders.byStatus["delivered"] || 0} delivered`} />
        <StatTile label="Active Products" value={stats.products.active} hint={`${stats.products.outOfStock} out of stock`} />
        <StatTile label="Blog Posts" value={stats.blogs.published} hint={`${stats.blogs.total - stats.blogs.published} drafts`} />
        <StatTile label="Categories" value={stats.categories.total} hint={`${stats.testimonials.total} testimonials`} />
      </div>

      {/* ── Attention alerts ────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest-x font-semibold text-ink-muted px-1">Needs attention</p>
          {alerts.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition hover:opacity-80",
                a.color,
              )}
            >
              <FaExclamationCircle className="h-4 w-4 shrink-0" />
              {a.label}
              <FaArrowRight className="h-3 w-3 ml-auto opacity-60" />
            </Link>
          ))}
        </div>
      )}

      {/* ── Charts row 1: Order status + Source breakdown ─── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Order status donut */}
        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaChartBar className="h-4 w-4 text-primary-600" />
            <h2 className="display text-xl font-semibold text-primary-700">Order status</h2>
          </div>
          {orderStatusData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-ink-muted">No orders yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || CHART_MUTED} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const label = String(name);
                      return [value ?? 0, label.charAt(0).toUpperCase() + label.slice(1)];
                    }}
                    contentStyle={{ borderRadius: 8, border: `1px solid ${CHART_BORDER}`, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-xs min-w-0">
                {orderStatusData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 bg-[var(--dot-color)]"
                      style={{ "--dot-color": STATUS_COLORS[d.name] || CHART_MUTED } as React.CSSProperties}
                    />
                    <span className="capitalize text-ink-soft truncate">{d.name}</span>
                    <span className="ml-auto font-semibold text-ink tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AdminCard>

        {/* Enquiry source donut */}
        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaChartBar className="h-4 w-4 text-primary-600" />
            <h2 className="display text-xl font-semibold text-primary-700">Enquiry sources</h2>
            <span className="ml-auto text-[10px] text-ink-muted">from recent orders</span>
          </div>
          {sourcePieData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-ink-muted">No data yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={sourcePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourcePieData.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${CHART_BORDER}`, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-xs min-w-0">
                {sourcePieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 bg-[var(--dot-color)]"
                      style={{ "--dot-color": SOURCE_COLORS[i % SOURCE_COLORS.length] } as React.CSSProperties}
                    />
                    <span className="text-ink-soft truncate">{d.name}</span>
                    <span className="ml-auto font-semibold text-ink tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      {/* ── Charts row 2: Products + Blog ───────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Products bar */}
        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaBoxOpen className="h-4 w-4 text-primary-600" />
            <h2 className="display text-xl font-semibold text-primary-700">Product inventory</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productBarData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${CHART_BORDER}`, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Active" fill={BRAND_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Out of Stock" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Inactive" fill={CHART_MUTED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className="display text-xl font-bold text-primary-600">{stats.products.total}</div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Total</div>
            </div>
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className="display text-xl font-bold text-green-700">{stats.products.active}</div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Active</div>
            </div>
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className="display text-xl font-bold text-red-600">{stats.products.outOfStock}</div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Out of Stock</div>
            </div>
          </div>
        </AdminCard>

        {/* Blog bar + pending reviews */}
        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaBlog className="h-4 w-4 text-primary-600" />
            <h2 className="display text-xl font-semibold text-primary-700">Content & reviews</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={blogBarData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${CHART_BORDER}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Published" fill={BRAND_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Drafts" fill={CHART_MUTED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className="display text-xl font-bold text-primary-600">{stats.blogs.total}</div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Total Posts</div>
            </div>
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className="display text-xl font-bold text-green-700">{stats.blogs.published}</div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Published</div>
            </div>
            <div className="rounded-lg bg-cream-50 p-3 border border-cream-200">
              <div className={cn("display text-xl font-bold", pendingTestimonials > 0 ? "text-amber-600" : "text-ink-muted")}>
                {pendingTestimonials}
              </div>
              <div className="text-[10px] uppercase tracking-widest-x text-ink-muted mt-0.5">Pending Reviews</div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* ── Order pipeline ──────────────────────────────────── */}
      <AdminCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="display text-xl font-semibold text-primary-700">Order pipeline</h2>
          <Link href="/admin/orders">
            <AdminButton variant="ghost">View all →</AdminButton>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {["new", "contacted", "quoted", "confirmed", "despatched", "delivered", "cancelled"].map((status) => {
            const count = stats.orders.byStatus[status] || 0;
            return (
              <div
                key={status}
                className={cn(
                  "rounded-lg border p-4",
                  count > 0 ? "border-cream-200 bg-cream-50" : "border-cream-100 bg-cream-50/50",
                )}
              >
                <div className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest-x font-bold", statusBadgeColor[status])}>
                  {status}
                </div>
                <div className="display text-2xl font-semibold text-primary-700 mt-2">{count}</div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      {/* ── Recent enquiries ────────────────────────────────── */}
      <AdminCard>
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between">
          <h2 className="display text-xl font-semibold text-primary-700">Recent enquiries</h2>
          <Link href="/admin/orders">
            <AdminButton variant="ghost">All orders →</AdminButton>
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-ink-muted">
            <FaCheckCircle className="h-8 w-8 mx-auto mb-2 text-cream-300" />
            No orders yet. New enquiries will appear here.
          </div>
        ) : (
          <div className="divide-y divide-cream-200">
            {stats.recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-cream-50 transition"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{o.customerName}</div>
                  <div className="text-xs text-ink-muted truncate">
                    {o.productName || "General enquiry"} · {o.phone}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={cn("hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest-x font-bold", sourceBadgeColor[o.source] || "bg-cream-100 text-ink-muted")}>
                    {sourceLabel[o.source] || o.source}
                  </span>
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-widest-x font-bold", statusBadgeColor[o.status])}>
                    {o.status}
                  </span>
                  <span className="text-xs text-ink-muted whitespace-nowrap">{moment(o.createdAt).fromNow()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>

      {/* ── Quick access ────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest-x font-semibold text-ink-muted px-1 mb-3">Quick access</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: "/admin/products",     Icon: FaBoxOpen,        label: "Products",     sub: `${stats.products.total} total` },
            { href: "/admin/orders",       Icon: FaInbox,          label: "Orders",       sub: `${stats.orders.new} new` },
            { href: "/admin/blogs",        Icon: FaBlog,           label: "Blog",         sub: `${stats.blogs.published} published` },
            { href: "/admin/categories",   Icon: FaTags,           label: "Categories",   sub: `${stats.categories.total} total` },
            { href: "/admin/testimonials", Icon: FaStar,           label: "Testimonials", sub: `${pendingTestimonials} pending` },
            { href: "/admin/banners",      Icon: FaBullhorn,       label: "Banners",      sub: "hero & cards" },
            { href: "/admin/offers",       Icon: FaPercent,        label: "Offers",       sub: "campaigns" },
            { href: "/admin/faqs",         Icon: FaQuestionCircle, label: "FAQs",         sub: "help content" },
          ].map(({ href, Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl bg-primary-600 text-cream-50 p-5 flex items-center gap-4 hover:bg-primary-500 transition group"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-white group-hover:scale-105 transition shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight">{label}</div>
                <div className="text-[11px] text-cream-300 mt-0.5 truncate">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile link */}
      <div className="flex justify-end">
        <Link href="/admin/profile" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary-600 transition">
          <FaUser className="h-3.5 w-3.5" />
          Manage profile & password
        </Link>
      </div>

    </div>
  );
}

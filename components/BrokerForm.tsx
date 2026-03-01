"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BrokerForm({ broker, onClose }: any) {
  const [form, setForm] = useState({
    name: broker?.name || "",
    slug: broker?.slug || "",
    logo_url: broker?.logo_url || "",
    account_opening: broker?.account_opening || "",
    account_maintenance: broker?.account_maintenance || "",
    equity_delivery: broker?.equity_delivery || "",
    equity_intraday: broker?.equity_intraday || "",
    futures: broker?.futures || "",
    options: broker?.options || "",
    cta_url: broker?.cta_url || "",
    sort_order: broker?.sort_order || 0,
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (broker?.id) {
      await supabase.from("brokers").update(form).eq("id", broker.id);
    } else {
      await supabase.from("brokers").insert(form);
    }

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        placeholder="Broker Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full rounded"
        required
      />

      <input
        placeholder="Slug"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Logo URL"
        value={form.logo_url}
        onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Account Opening"
        value={form.account_opening}
        onChange={(e) => setForm({ ...form, account_opening: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Equity Delivery"
        value={form.equity_delivery}
        onChange={(e) => setForm({ ...form, equity_delivery: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Intraday"
        value={form.equity_intraday}
        onChange={(e) => setForm({ ...form, equity_intraday: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="CTA URL"
        value={form.cta_url}
        onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <button className="bg-black text-white px-4 py-2 rounded w-full">
        Save Broker
      </button>
    </form>
  );
}
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

function toNullableText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function AdminBrokerForm({
  broker,
  onClose,
}: {
  broker?: any;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState(false);

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
    notes: broker?.notes || "",
    sort_order: broker?.sort_order?.toString() || "0",
    is_active: broker?.is_active ?? true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const nextValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Broker name is required");
      return;
    }

    if (form.cta_url.trim() && !isValidUrl(form.cta_url.trim())) {
      alert("CTA URL must be a valid http/https URL");
      return;
    }

    const finalSlug = form.slug.trim() || generateSlug(form.name);
    if (!finalSlug) {
      alert("Unable to generate slug");
      return;
    }

    setLoading(true);

    try {
      const sortOrderValue = Number(form.sort_order.trim());

      const payload = {
        name: form.name.trim(),
        slug: finalSlug,
        logo_url: toNullableText(form.logo_url),
        account_opening: toNullableText(form.account_opening),
        account_maintenance: toNullableText(form.account_maintenance),
        equity_delivery: toNullableText(form.equity_delivery),
        equity_intraday: toNullableText(form.equity_intraday),
        futures: toNullableText(form.futures),
        options: toNullableText(form.options),
        cta_url: toNullableText(form.cta_url),
        notes: toNullableText(form.notes),
        sort_order: Number.isNaN(sortOrderValue) ? 0 : sortOrderValue,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (broker?.id) {
        const res = await supabase
          .from("brokers")
          .update(payload)
          .eq("id", broker.id);
        error = res.error;
      } else {
        const res = await supabase
          .from("brokers")
          .insert([payload]);
        error = res.error;
      }

      if (error) {
        console.error(error);
        alert("Error saving broker");
        return;
      }

      alert("Broker saved ✅");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving broker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Broker Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="slug"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <input
        name="logo_url"
        placeholder="Logo URL (optional)"
        value={form.logo_url}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          name="account_opening"
          placeholder="Account Opening"
          value={form.account_opening}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="account_maintenance"
          placeholder="Account Maintenance"
          value={form.account_maintenance}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="equity_delivery"
          placeholder="Equity Delivery"
          value={form.equity_delivery}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="equity_intraday"
          placeholder="Equity Intraday"
          value={form.equity_intraday}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="futures"
          placeholder="Futures"
          value={form.futures}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="options"
          placeholder="Options"
          value={form.options}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <input
        name="cta_url"
        placeholder="CTA URL (Open Account link)"
        value={form.cta_url}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="border p-2 rounded w-full min-h-20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="sort_order"
          type="number"
          placeholder="Sort Order"
          value={form.sort_order}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <label className="inline-flex items-center gap-2 border p-2 rounded">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          <span className="text-sm text-[#334155]">Active</span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : broker ? "Update Broker" : "Save Broker"}
      </button>
    </form>
  );
}

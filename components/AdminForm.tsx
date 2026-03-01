"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

function toNullableText(value: any) {
  if (value === null || value === undefined) return null;

  const str = String(value);
  const trimmed = str.trim();

  return trimmed ? trimmed : null;
}

function toNullableNumber(value: any) {
  if (value === null || value === undefined || value === "") return null;

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

export default function AdminForm({ ipo, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");

  const [form, setForm] = useState(() => ({
    name: ipo?.name || "",
    exchange: ipo?.exchange || "",
    sector: ipo?.sector || "",
    ipo_type: ipo?.ipo_type || "mainboard",
    listing_date: ipo?.listing_date || "",
    price_min: ipo?.price_min?.toString?.() || "",
    price_max: ipo?.price_max?.toString?.() || "",
    open_date: ipo?.open_date || "",
    close_date: ipo?.close_date || "",
    gmp: ipo?.gmp?.toString?.() || "",
    sub_total: ipo?.sub_total?.toString?.() || "",
    sub_qib: ipo?.sub_qib?.toString?.() || "",
    sub_nii: ipo?.sub_nii?.toString?.() || "",
    sub_rii: ipo?.sub_rii?.toString?.() || "",
    sub_bhni: ipo?.sub_bhni?.toString?.() || "",
    sub_shni: ipo?.sub_shni?.toString?.() || "",
    subscription_updated_at: ipo?.subscription_updated_at || "",
    lot_size: ipo?.lot_size?.toString?.() || "",
    status: ipo?.status || "",
    about_company: ipo?.about_company || "",
    objectives: ipo?.objectives || "",
    company_strengths: ipo?.company_strengths || "",
    company_risks: ipo?.company_risks || "",
    promoter_holding_pre: ipo?.promoter_holding_pre?.toString?.() || "",
    promoter_holding_post: ipo?.promoter_holding_post?.toString?.() || "",
    reservation_qib: ipo?.reservation_qib?.toString?.() || "",
    reservation_nii: ipo?.reservation_nii?.toString?.() || "",
    reservation_rii: ipo?.reservation_rii?.toString?.() || "",
    reservation_employee: ipo?.reservation_employee?.toString?.() || "",
    lead_managers: ipo?.lead_managers || "",
    registrar: ipo?.registrar || "",
    drhp_link: ipo?.drhp_link || "",
    rhp_link: ipo?.rhp_link || "",
    allotment_link: ipo?.allotment_link || "",
    listing_exchange: ipo?.listing_exchange || "",
    listing_price: ipo?.listing_price?.toString?.() || "",
    listing_gain_percent: ipo?.listing_gain_percent?.toString?.() || "",
    allotment_date: ipo?.allotment_date || "",
    refund_date: ipo?.refund_date || "",
    allotment_status: ipo?.allotment_status || "",

    // Issue details
    face_value: ipo?.face_value || "",
    issue_size: ipo?.issue_size || "",
    fresh_issue: ipo?.fresh_issue || "",

    // Lot table
    retail_min_lots: ipo?.retail_min_lots?.toString?.() || "",
    retail_min_shares: ipo?.retail_min_shares?.toString?.() || "",
    retail_min_amount: ipo?.retail_min_amount?.toString?.() || "",
    retail_max_lots: ipo?.retail_max_lots?.toString?.() || "",
    retail_max_shares: ipo?.retail_max_shares?.toString?.() || "",
    retail_max_amount: ipo?.retail_max_amount?.toString?.() || "",
    shni_lots: ipo?.shni_lots?.toString?.() || "",
    shni_shares: ipo?.shni_shares?.toString?.() || "",
    shni_amount: ipo?.shni_amount?.toString?.() || "",
    bhni_lots: ipo?.bhni_lots?.toString?.() || "",
    bhni_shares: ipo?.bhni_shares?.toString?.() || "",
    bhni_amount: ipo?.bhni_amount?.toString?.() || "",

    // Valuation
    eps_pre: ipo?.eps_pre?.toString?.() || "",
    eps_post: ipo?.eps_post?.toString?.() || "",
    pe_pre: ipo?.pe_pre?.toString?.() || "",
    pe_post: ipo?.pe_post?.toString?.() || "",
    roce: ipo?.roce?.toString?.() || "",
    debt_equity: ipo?.debt_equity?.toString?.() || "",
    pat_margin: ipo?.pat_margin?.toString?.() || "",
    market_cap: ipo?.market_cap?.toString?.() || "",

    // Contacts
    company_address: ipo?.company_address || "",
    company_phone: ipo?.company_phone || "",
    company_email: ipo?.company_email || "",
    company_website: ipo?.company_website || "",
    registrar_phone: ipo?.registrar_phone || "",
    registrar_email: ipo?.registrar_email || "",
    registrar_website: ipo?.registrar_website || "",
  }));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return (
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") + "-ipo"
    );
  };

  const fetchDetails = async () => {
    if (!form.name) {
      alert("Enter company name first");
      return;
    }

    try {
      setAutoLoading(true);

      const res = await fetch("/api/fetch-ipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: form.name }),
      });

      const data = await res.json();

      if (data.logo) setLogo(data.logo);
      if (data.industry) {
        setForm((prev) => ({ ...prev, sector: data.industry }));
      }
      if (data.description) {
        setDescription(data.description);
        setForm((prev) => ({
          ...prev,
          about_company: prev.about_company || data.description,
        }));
      }
      if (data.gmp !== undefined && data.gmp !== null) {
        setForm((prev) => ({ ...prev, gmp: String(data.gmp) }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch IPO details");
    } finally {
      setAutoLoading(false);
    }
  };

  const fetchGMP = async () => {
    if (!form.name) {
      alert("Enter company name first");
      return;
    }

    try {
      setAutoLoading(true);

      const res = await fetch("/api/fetch-gmp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: form.name }),
      });

      const data = await res.json();

      if (data?.gmp !== undefined && data.gmp !== null) {
        setForm((prev) => ({ ...prev, gmp: String(data.gmp) }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch GMP");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Company name is required");
      return;
    }

    setLoading(true);

    try {
      const gmpValue = toNullableNumber(form.gmp);

      let data: any = null;
      let error: any = null;

      const payload = {
        name: form.name.trim(),
        // Keep existing slug on update to avoid unique conflicts
        slug: ipo?.slug || generateSlug(form.name),
        exchange: toNullableText(form.exchange),
        sector: toNullableText(form.sector),
        ipo_type: form.ipo_type || "mainboard",
        listing_date: toNullableText(form.listing_date),
        price_min: toNullableNumber(form.price_min),
        price_max: toNullableNumber(form.price_max),
        open_date: toNullableText(form.open_date),
        close_date: toNullableText(form.close_date),
        gmp: gmpValue,
        sub_total: toNullableNumber(form.sub_total),
        sub_qib: toNullableNumber(form.sub_qib),
        sub_nii: toNullableNumber(form.sub_nii),
        sub_rii: toNullableNumber(form.sub_rii),
        lot_size: toNullableNumber(form.lot_size),
        status: toNullableText(form.status),
        about_company: toNullableText(form.about_company),
        objectives: toNullableText(form.objectives),
        company_strengths: toNullableText(form.company_strengths),
        company_risks: toNullableText(form.company_risks),
        promoter_holding_pre: toNullableNumber(form.promoter_holding_pre),
        promoter_holding_post: toNullableNumber(form.promoter_holding_post),
        reservation_qib: toNullableNumber(form.reservation_qib),
        reservation_nii: toNullableNumber(form.reservation_nii),
        reservation_rii: toNullableNumber(form.reservation_rii),
        reservation_employee: toNullableNumber(form.reservation_employee),
        lead_managers: toNullableText(form.lead_managers),
        registrar: toNullableText(form.registrar),
        drhp_link: toNullableText(form.drhp_link),
        rhp_link: toNullableText(form.rhp_link),
        allotment_link: toNullableText(form.allotment_link),
        listing_exchange: toNullableText(form.listing_exchange),
        listing_price: toNullableNumber(form.listing_price),
        listing_gain_percent: toNullableNumber(form.listing_gain_percent),
        allotment_date: toNullableText(form.allotment_date),
        refund_date: toNullableText(form.refund_date),
        allotment_status: toNullableText(form.allotment_status),
        allotment_out: form.allotment_status === "out",

        face_value: toNullableText(form.face_value),
        issue_size: toNullableText(form.issue_size),
        fresh_issue: toNullableText(form.fresh_issue),

        retail_min_lots: toNullableNumber(form.retail_min_lots),
        retail_min_shares: toNullableNumber(form.retail_min_shares),
        retail_min_amount: toNullableNumber(form.retail_min_amount),
        retail_max_lots: toNullableNumber(form.retail_max_lots),
        retail_max_shares: toNullableNumber(form.retail_max_shares),
        retail_max_amount: toNullableNumber(form.retail_max_amount),
        shni_lots: toNullableNumber(form.shni_lots),
        shni_shares: toNullableNumber(form.shni_shares),
        shni_amount: toNullableNumber(form.shni_amount),
        bhni_lots: toNullableNumber(form.bhni_lots),
        bhni_shares: toNullableNumber(form.bhni_shares),
        bhni_amount: toNullableNumber(form.bhni_amount),

        eps_pre: toNullableNumber(form.eps_pre),
        eps_post: toNullableNumber(form.eps_post),
        pe_pre: toNullableNumber(form.pe_pre),
        pe_post: toNullableNumber(form.pe_post),
        roce: toNullableNumber(form.roce),
        debt_equity: toNullableNumber(form.debt_equity),
        pat_margin: toNullableNumber(form.pat_margin),
        market_cap: toNullableNumber(form.market_cap),

        company_address: toNullableText(form.company_address),
        company_phone: toNullableText(form.company_phone),
        company_email: toNullableText(form.company_email),
        company_website: toNullableText(form.company_website),
        registrar_phone: toNullableText(form.registrar_phone),
        registrar_email: toNullableText(form.registrar_email),
        registrar_website: toNullableText(form.registrar_website),

        sub_bhni: toNullableNumber(form.sub_bhni),
        sub_shni: toNullableNumber(form.sub_shni),
        subscription_updated_at: toNullableText(form.subscription_updated_at),
      };

      if (ipo?.id) {
        const res = await supabase
          .from("ipos")
          .update(payload)
          .eq("id", ipo.id)
          .select()
          .single();
        data = res.data;
        error = res.error;
      } else {
        const res = await supabase
          .from("ipos")
          .insert([payload])
          .select()
          .single();
        data = res.data;
        error = res.error;
      }

      if (error) {
        console.error("SUPABASE ERROR:", error);
        alert(
          (ipo?.id ? "Error updating IPO: " : "Error adding IPO: ") +
            (error.message || "Unknown error")
        );
        return;
      }

      // ===== GMP HISTORY INSERT (AUTO — ONLY WHEN CHANGED) =====
      try {
        const ipoId = data?.id ?? ipo?.id;

        const newGmp = gmpValue;
        const oldGmp = ipo?.gmp ?? null;

        if (
          ipoId &&
          newGmp !== null &&
          Number(newGmp) !== Number(oldGmp)
        ) {
          const { error: historyError } = await supabase
            .from("gmp_history")
            .insert({
              ipo_id: Number(ipoId),
              gmp: Number(newGmp),
            });

          if (historyError) {
            console.error("GMP history insert failed:", historyError);
          }
        }
      } catch (err) {
        console.error("GMP history exception:", err);
      }

      alert(ipo?.id ? "IPO Updated ✅" : "IPO Added ✅");
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(ipo?.id ? "Error updating IPO" : "Error adding IPO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="button"
          onClick={fetchDetails}
          className="bg-purple-600 text-white px-3 py-2 rounded"
          disabled={autoLoading}
        >
          {autoLoading ? "Fetching..." : "Auto Fetch"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="exchange"
          placeholder="Exchange"
          value={form.exchange}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="sector"
          placeholder="Sector"
          value={form.sector}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="ipo_type" className="text-sm font-medium text-gray-700">
            IPO Type
          </label>
          <select
            id="ipo_type"
            name="ipo_type"
            value={form.ipo_type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="mainboard">Mainboard</option>
            <option value="sme">SME</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="listing_date" className="text-sm font-medium text-gray-700">
            Listing Date
          </label>
          <input
            id="listing_date"
            name="listing_date"
            type="date"
            value={form.listing_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {logo && <img src={logo} alt="logo" className="h-12 w-12 object-contain" />}

      {description && (
        <textarea
          value={description}
          readOnly
          className="border p-2 rounded w-full"
        />
      )}

      <textarea
        name="about_company"
        placeholder="About Company"
        value={form.about_company}
        onChange={handleChange}
        className="border p-2 rounded w-full min-h-24"
      />

      <textarea
        name="objectives"
        placeholder="Objectives of Issue"
        value={form.objectives}
        onChange={handleChange}
        className="border p-2 rounded w-full min-h-20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <textarea
          name="company_strengths"
          placeholder="Company Strengths"
          value={form.company_strengths}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-20"
        />
        <textarea
          name="company_risks"
          placeholder="Company Risks"
          value={form.company_risks}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="price_min"
          placeholder="Price Min"
          value={form.price_min}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="price_max"
          placeholder="Price Max"
          value={form.price_max}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="lot_size"
          placeholder="Lot Size"
          value={form.lot_size}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="open_date"
          type="date"
          value={form.open_date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="close_date"
          type="date"
          value={form.close_date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex gap-2">
        <input
          name="gmp"
          placeholder="GMP"
          value={form.gmp}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="button"
          onClick={fetchGMP}
          className="bg-gray-200 px-3 py-2 rounded"
          disabled={autoLoading}
        >
          {autoLoading ? "..." : "Fetch GMP"}
        </button>
      </div>

      <input
        name="status"
        placeholder="Status (Open / Upcoming / Listed / Closed)"
        value={form.status}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          name="sub_total"
          placeholder="Total Subscription (x)"
          value={form.sub_total}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="sub_qib"
          placeholder="QIB Subscription (x)"
          value={form.sub_qib}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="sub_nii"
          placeholder="NII Subscription (x)"
          value={form.sub_nii}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="sub_rii"
          placeholder="RII Subscription (x)"
          value={form.sub_rii}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="sub_bhni" placeholder="BHNI Subscription (x)" value={form.sub_bhni} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="sub_shni" placeholder="SHNI Subscription (x)" value={form.sub_shni} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="subscription_updated_at" placeholder="Subscription Last Updated" value={form.subscription_updated_at} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="promoter_holding_pre"
          placeholder="Promoter Holding Pre (%)"
          value={form.promoter_holding_pre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="promoter_holding_post"
          placeholder="Promoter Holding Post (%)"
          value={form.promoter_holding_post}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          name="reservation_qib"
          placeholder="Reservation QIB (%)"
          value={form.reservation_qib}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="reservation_nii"
          placeholder="Reservation NII (%)"
          value={form.reservation_nii}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="reservation_rii"
          placeholder="Reservation RII (%)"
          value={form.reservation_rii}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="reservation_employee"
          placeholder="Reservation Employee (%)"
          value={form.reservation_employee}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="lead_managers"
          placeholder="Lead Managers"
          value={form.lead_managers}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="registrar"
          placeholder="Registrar"
          value={form.registrar}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="drhp_link"
          placeholder="DRHP Link"
          value={form.drhp_link}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="rhp_link"
          placeholder="RHP Link"
          value={form.rhp_link}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="allotment_link"
          placeholder="Allotment Status Link"
          value={form.allotment_link}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <p className="text-xs text-gray-500">
        This link will be used for the "Check Allotment" button when status is Out.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="listing_exchange"
          placeholder="Listing Exchange"
          value={form.listing_exchange}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="listing_price"
          placeholder="Listing Price"
          value={form.listing_price}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="listing_gain_percent"
          placeholder="Listing Gain (%)"
          value={form.listing_gain_percent}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Allotment Date
          </label>
          <input
            name="allotment_date"
            type="date"
            value={form.allotment_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Refund Date
          </label>
          <input
            name="refund_date"
            type="date"
            value={form.refund_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Allotment Status
          </label>

          <div className="flex items-center gap-3">
            <select
              name="allotment_status"
              value={form.allotment_status || "pending"}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="pending">Allotment Awaited</option>
              <option value="out">Allotment Out</option>
            </select>

            {/* Quick toggle for admin */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.allotment_status === "out"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    allotment_status: e.target.checked ? "out" : "pending",
                  }))
                }
              />
              Mark Out
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Select "Allotment Out" when registrar releases results.
          </p>
        </div>
      </div>

      {/* Issue Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="face_value" placeholder="Face Value" value={form.face_value} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="issue_size" placeholder="Total Issue Size" value={form.issue_size} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="fresh_issue" placeholder="Fresh Issue" value={form.fresh_issue} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      {/* Lot Table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="retail_min_lots" placeholder="Retail Min Lots" value={form.retail_min_lots} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="retail_min_shares" placeholder="Retail Min Shares" value={form.retail_min_shares} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="retail_min_amount" placeholder="Retail Min Amount" value={form.retail_min_amount} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="retail_max_lots" placeholder="Retail Max Lots" value={form.retail_max_lots} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="retail_max_shares" placeholder="Retail Max Shares" value={form.retail_max_shares} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="retail_max_amount" placeholder="Retail Max Amount" value={form.retail_max_amount} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="shni_lots" placeholder="SHNI Lots" value={form.shni_lots} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="shni_shares" placeholder="SHNI Shares" value={form.shni_shares} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="shni_amount" placeholder="SHNI Amount" value={form.shni_amount} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="bhni_lots" placeholder="BHNI Lots" value={form.bhni_lots} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="bhni_shares" placeholder="BHNI Shares" value={form.bhni_shares} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="bhni_amount" placeholder="BHNI Amount" value={form.bhni_amount} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      {/* Valuation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input name="eps_pre" placeholder="EPS Pre IPO" value={form.eps_pre} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="eps_post" placeholder="EPS Post IPO" value={form.eps_post} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="pe_pre" placeholder="PE Pre IPO" value={form.pe_pre} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="pe_post" placeholder="PE Post IPO" value={form.pe_post} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="roce" placeholder="ROCE %" value={form.roce} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="debt_equity" placeholder="Debt / Equity" value={form.debt_equity} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="pat_margin" placeholder="PAT Margin %" value={form.pat_margin} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="market_cap" placeholder="Market Cap (Cr)" value={form.market_cap} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      {/* Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="company_address" placeholder="Company Address" value={form.company_address} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="company_phone" placeholder="Company Phone" value={form.company_phone} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="company_email" placeholder="Company Email" value={form.company_email} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="company_website" placeholder="Company Website" value={form.company_website} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="registrar_phone" placeholder="Registrar Phone" value={form.registrar_phone} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="registrar_email" placeholder="Registrar Email" value={form.registrar_email} onChange={handleChange} className="border p-2 rounded w-full" />
        <input name="registrar_website" placeholder="Registrar Website" value={form.registrar_website} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? (ipo?.id ? "Updating..." : "Adding...") : (ipo?.id ? "Update IPO" : "Add IPO")}
      </button>
    </form>
  );
}
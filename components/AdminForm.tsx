"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminForm() {
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const [form, setForm] = useState({
    name: "",
    exchange: "",
    sector: "",
    price_min: "",
    price_max: "",
    gmp: "",
    lot_size: "",
    status: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      // Auto-fill fields
      if (data.logo) setLogo(data.logo);
      if (data.industry) {
        setIndustry(data.industry);
        setForm((prev) => ({ ...prev, sector: data.industry }));
      }
      if (data.description) setDescription(data.description);
      if (data.gmp) {
        setForm((prev) => ({ ...prev, gmp: data.gmp }));
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

      if (data?.gmp !== undefined) {
        setForm((prev) => ({ ...prev, gmp: data.gmp }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch GMP");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // VERY IMPORTANT

    setLoading(true);

    const { error } = await supabase.from("ipos").insert([
      {
        name: form.name,
        slug: generateSlug(form.name),
        exchange: form.exchange,
        sector: form.sector,
        price_min: Number(form.price_min),
        price_max: Number(form.price_max),
        gmp: Number(form.gmp),
        lot_size: Number(form.lot_size),
        status: form.status,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding IPO");
    } else {
      alert("IPO Added ✅");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="Company Name"
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
      <input
        name="exchange"
        placeholder="Exchange"
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      {logo && (
        <img src={logo} alt="logo" className="h-12 w-12 object-contain" />
      )}

      {description && (
        <textarea
          value={description}
          readOnly
          className="border p-2 rounded w-full"
        />
      )}
      <input
        name="sector"
        placeholder="Sector"
        value={form.sector}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <input
        name="price_min"
        placeholder="Price Min"
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <input
        name="price_max"
        placeholder="Price Max"
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
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
        name="lot_size"
        placeholder="Lot Size"
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <input
        name="status"
        placeholder="Status"
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add IPO"}
      </button>
    </form>
  );
}
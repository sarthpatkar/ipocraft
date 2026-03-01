"use client";

import BrokerForm from "./BrokerForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import AdminForm from "./AdminForm";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "ipos" | "brokers" | "settings";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("ipos");

  const [ipos, setIpos] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [editingIpo, setEditingIpo] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Brokers state
  const [brokers, setBrokers] = useState<any[]>([]);
  const [brokerLoading, setBrokerLoading] = useState(true);
  const [editingBroker, setEditingBroker] = useState<any | null>(null);
  const [showBrokerForm, setShowBrokerForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [inlineGmp, setInlineGmp] = useState<Record<string, number | "">>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"ipo" | "broker" | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function getStatusClass(status: string | null) {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Listed":
        return "bg-purple-100 text-purple-700";
      case "Closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function getAllotmentClass(status: string | null) {
    switch (status) {
      case "out":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  async function fetchIpos() {
    setLoading(true);

    const { data } = await supabase
      .from("ipos")
      .select("*")
      .order("created_at", { ascending: false });

    const list = data || [];
    setIpos(list);
    setFiltered(list);
    setLoading(false);
  }

  async function fetchBrokers() {
    setBrokerLoading(true);

    const { data } = await supabase
      .from("brokers")
      .select("*")
      .order("sort_order", { ascending: true });

    setBrokers(data || []);
    setBrokerLoading(false);
  }

  useEffect(() => {
    fetchIpos();
    fetchBrokers();
  }, []);

  useEffect(() => {
    let list = [...ipos];

    if (statusFilter !== "All") {
      list = list.filter((i) => i.status === statusFilter);
    }

    const q = search.toLowerCase();
    list = list.filter(
      (ipo) =>
        ipo.name?.toLowerCase().includes(q) ||
        ipo.status?.toLowerCase().includes(q)
    );

    setFiltered(list);
  }, [search, ipos, statusFilter]);

  async function deleteIpo(id: string, name?: string) {
    setDeleteId(id);
    setDeleteType("ipo");
    setDeleteName(name ?? null);
  }

  async function deleteBroker(id: string, name?: string) {
    setDeleteId(id);
    setDeleteType("broker");
    setDeleteName(name ?? null);
  }
  async function confirmDelete() {
    if (!deleteId || !deleteType) return;

    setDeleting(true);

    try {
      if (deleteType === "ipo") {
        const { error } = await supabase
          .from("ipos")
          .delete()
          .eq("id", deleteId);

        if (error) throw error;

        setToast("IPO deleted successfully");
        await fetchIpos();
      }

      if (deleteType === "broker") {
        const { error } = await supabase
          .from("brokers")
          .delete()
          .eq("id", deleteId);

        if (error) throw error;

        setToast("Broker deleted successfully");
        await fetchBrokers();
      }
    } catch (e: any) {
      console.error("Delete error:", e);
      setToast(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setDeleteType(null);
      setDeleteName(null);

      setTimeout(() => setToast(null), 2500);
    }
  }

  async function duplicateIpo(ipo: any) {
    const payload = { ...ipo };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    payload.name = `${ipo.name} (Copy)`;
    payload.slug = `${ipo.slug}-copy-${Date.now()}`;

    await supabase.from("ipos").insert(payload);
    fetchIpos();
  }

  async function updateGmp(ipo: any) {
    const value = inlineGmp[ipo.id];
    if (value === "" || value === undefined) return;

    const gmp = Number(value);
    if (isNaN(gmp)) {
      alert("Invalid GMP");
      return;
    }

    const { error } = await supabase
      .from("ipos")
      .update({ gmp })
      .eq("id", ipo.id);

    if (error) {
      console.error("GMP update error:", error);
      alert(error.message || "Failed to update GMP");
      return;
    }

    try {
      const { error: historyError } = await supabase.from("gmp_history").insert({
        ipo_id: ipo.id,
        gmp,
      });

      if (historyError) {
        console.warn("GMP history insert failed:", historyError);
        setToast("GMP updated (history not saved)");
      }
    } catch (err) {
      console.warn("GMP history exception:", err);
      setToast("GMP updated (history not saved)");
    }

    setInlineGmp((prev) => ({ ...prev, [ipo.id]: "" }));
    setToast("GMP updated successfully");
    setTimeout(() => setToast(null), 2500);
    fetchIpos();
  }

  async function saveBroker() {
    if (!editingBroker?.name) {
      alert("Broker name required");
      return;
    }

    if (editingBroker.id) {
      await supabase
        .from("brokers")
        .update(editingBroker)
        .eq("id", editingBroker.id);
    } else {
      await supabase.from("brokers").insert(editingBroker);
    }

    setShowBrokerForm(false);
    setEditingBroker(null);
    fetchBrokers();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">IPOCraft Admin</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: "ipos", label: "IPOs" },
            { id: "brokers", label: "Brokers" },
            { id: "settings", label: "Settings" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`px-4 py-2 -mb-px border-b-2 ${
                tab === t.id
                  ? "border-black font-semibold"
                  : "border-transparent text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* IPO TAB */}
      {tab === "ipos" && (
        <>
          {/* IPO Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Total IPOs</div>
              <div className="text-xl font-semibold">{ipos.length}</div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Open IPOs</div>
              <div className="text-xl font-semibold">
                {ipos.filter((i) => i.status === "Open").length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Listed IPOs</div>
              <div className="text-xl font-semibold">
                {ipos.filter((i) => i.status === "Listed").length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Upcoming IPOs</div>
              <div className="text-xl font-semibold">
                {ipos.filter((i) => i.status === "Upcoming").length}
              </div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-3">
              <input
                placeholder="Search IPO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-60"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option>All</option>
                <option>Open</option>
                <option>Upcoming</option>
                <option>Listed</option>
                <option>Closed</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingIpo(null);
                setShowForm(true);
              }}
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            >
              + Add IPO
            </button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Allotment</th>
                  <th>Listing</th>
                  <th>Price</th>
                  <th>GMP</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Loading IPO data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No IPOs found. Try adjusting filters or add a new IPO.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ipo) => (
                    <tr key={ipo.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{ipo.name}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ipo.ipo_type === "SME"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ipo.ipo_type ?? "-"}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusClass(ipo.status)}`}>
                          {ipo.status ?? "-"}
                        </span>
                      </td>
                      <td>{ipo.open_date ?? "-"}</td>
                      <td>{ipo.close_date ?? "-"}</td>

                      <td>
                        <div className="flex flex-col">
                          <span>{ipo.allotment_date ?? "-"}</span>

                          {ipo.allotment_status && (
                            <span
                              className={`mt-1 px-2 py-0.5 rounded text-xs w-fit ${getAllotmentClass(
                                ipo.allotment_status
                              )}`}
                            >
                              {ipo.allotment_status === "out"
                                ? "Allotment Out"
                                : "Awaited"}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>{ipo.listing_date ?? "-"}</td>

                      <td>
                        ₹{ipo.price_min ?? "-"} - ₹{ipo.price_max ?? "-"}
                      </td>
                      <td className="flex items-center gap-2">
                        <input
                          type="number"
                          value={inlineGmp[ipo.id] ?? ipo.gmp ?? ""}
                          onChange={(e) =>
                            setInlineGmp((prev) => ({
                              ...prev,
                              [ipo.id]: e.target.value === "" ? "" : Number(e.target.value),
                            }))
                          }
                          className="border rounded px-2 py-1 w-20 text-sm"
                        />
                        <button
                          onClick={() => updateGmp(ipo)}
                          className="text-green-600 hover:underline text-xs"
                        >
                          Save
                        </button>
                      </td>

                      <td className="text-right pr-4 space-x-3">
                        <button
                          onClick={() => {
                            setEditingIpo(ipo);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => window.open(`/ipo/${ipo.slug}`, "_blank")}
                          className="text-gray-700 hover:underline"
                        >
                          View
                        </button>

                        <button
                          onClick={() => duplicateIpo(ipo)}
                          className="text-purple-600 hover:underline"
                        >
                          Duplicate
                        </button>

                        <button
                          onClick={() => deleteIpo(ipo.id, ipo.name)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* BROKERS TAB */}
      {tab === "brokers" && (
        <>
          {/* Broker Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Total Brokers</div>
              <div className="text-xl font-semibold">{brokers.length}</div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Active Brokers</div>
              <div className="text-xl font-semibold">
                {brokers.filter((b) => b.is_active !== false).length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">Inactive</div>
              <div className="text-xl font-semibold">
                {brokers.filter((b) => b.is_active === false).length}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Broker Management</h2>

            <button
              onClick={() => {
                setEditingBroker({});
                setShowBrokerForm(true);
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              + Add Broker
            </button>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Broker</th>
                  <th>Delivery</th>
                  <th>Intraday</th>
                  <th>Account Opening</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {brokerLoading ? (
                  <tr>
                    <td className="p-4">Loading...</td>
                  </tr>
                ) : brokers.length === 0 ? (
                  <tr>
                    <td className="p-4">No brokers found</td>
                  </tr>
                ) : (
                  brokers.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td>{b.equity_delivery ?? "-"}</td>
                      <td>{b.equity_intraday ?? "-"}</td>
                      <td>{b.account_opening ?? "-"}</td>

                      <td className="text-right pr-4 space-x-3">
                        <button
                          onClick={() => {
                            setEditingBroker(b);
                            setShowBrokerForm(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteBroker(b.id, b.name)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">
            Future settings like automation, cron jobs, SEO, disclaimers.
          </p>
        </div>
      )}

      {/* Broker Modal */}
      {showBrokerForm && (
        <BrokerForm
          broker={editingBroker}
          onClose={() => {
            setShowBrokerForm(false);
            setEditingBroker(null);
            fetchBrokers();
          }}
        />
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-auto p-6 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingIpo ? "Edit IPO" : "Add IPO"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <AdminForm
              ipo={editingIpo}
              onClose={() => {
                setShowForm(false);
                fetchIpos();
              }}
            />
          </div>
        </div>
      )}
      {/* Delete Confirm Modal */}
      {deleteId && (
        <DeleteConfirmModal
          open={true}
          title="Confirm Delete"
          description={`Delete "${deleteName ?? ""}"? This action cannot be undone.`}
          onCancel={() => {
            setDeleteId(null);
            setDeleteType(null);
            setDeleteName(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
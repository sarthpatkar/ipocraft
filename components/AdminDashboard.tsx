"use client";

import BrokerForm from "./BrokerForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import AdminForm from "./AdminForm";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import {
  deleteIpoAction,
  deleteBrokerAction,
  duplicateIpoAction,
  updateGmpAction,
  saveBrokerAction,
  triggerFinapiSyncAction,
  getFinapiStatusAction,
} from "@/app/actions/admin";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "ipos" | "brokers" | "settings";
type IpoRecord = {
  [key: string]: string | number | boolean | null | undefined;
  id: string;
  name?: string | null;
  slug?: string | null;
  status?: string | null;
  ipo_type?: string | null;
  open_date?: string | null;
  close_date?: string | null;
  allotment_date?: string | null;
  allotment_status?: string | null;
  listing_date?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  gmp?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};
type BrokerRecord = {
  [key: string]: string | number | boolean | null | undefined;
  id?: string;
  name?: string | null;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("ipos");

  const [ipos, setIpos] = useState<IpoRecord[]>([]);
  const [filtered, setFiltered] = useState<IpoRecord[]>([]);
  const [editingIpo, setEditingIpo] = useState<IpoRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Brokers state
  const [brokers, setBrokers] = useState<BrokerRecord[]>([]);
  const [brokerLoading, setBrokerLoading] = useState(true);
  const [editingBroker, setEditingBroker] = useState<BrokerRecord | null>(null);
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

  // FinAPI Live Automation State
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    lastSyncAt: string | null;
    lastSubscriptionSyncAt: string | null;
    rateLimit: { remainingEndpoint: number | null };
  } | null>(null);

  function getStatusClass(status: string | null) {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Listed":
        return "bg-purple-100 text-purple-700";
      case "Closed":
        return "bg-gray-200 text-gray-700 dark:text-slate-300";
      default:
        return "bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-slate-400";
    }
  }

  function getAllotmentClass(status: string | null) {
    switch (status) {
      case "out":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-slate-400";
    }
  }

  async function fetchIpos() {
    setLoading(true);

    const { data } = await supabase
      .from("ipos")
      .select("*");

    const list = sortIposByNewestOpenDate(data || []);
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

  async function fetchFinapiStatus() {
    try {
      const res = await getFinapiStatusAction();
      setSyncStatus(res);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchIpos();
    fetchBrokers();
    fetchFinapiStatus();
  }, []);

  async function handleTriggerFinapiSync(type: "all" | "subs" | "gmp" = "all") {
    try {
      setSyncing(true);
      const res = await triggerFinapiSyncAction({ syncType: type, bypassCache: true });
      if (res.success) {
        setToast(
          `Sync Completed: ${res.totalFetched} fetched (${res.insertedCount} new added, ${res.updatedCount} updated, ${res.gmpPointsCount} GMP points)`
        );
      } else {
        setToast(`Sync Warning: ${res.errors.join(", ")}`);
      }
      setTimeout(() => setToast(null), 5000);
      await fetchIpos();
      await fetchFinapiStatus();
    } catch (err: any) {
      alert(err?.message || "Failed to trigger FinAPI sync");
    } finally {
      setSyncing(false);
    }
  }

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
        await deleteIpoAction(deleteId);
        setToast("IPO deleted successfully");
        await fetchIpos();
      }

      if (deleteType === "broker") {
        await deleteBrokerAction(deleteId);
        setToast("Broker deleted successfully");
        await fetchBrokers();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Delete failed";
      console.error("Delete error:", e);
      setToast(message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setDeleteType(null);
      setDeleteName(null);

      setTimeout(() => setToast(null), 2500);
    }
  }

  async function duplicateIpo(ipo: IpoRecord) {
    try {
      await duplicateIpoAction(ipo);
      fetchIpos();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to duplicate IPO");
    }
  }

  async function updateGmp(ipo: IpoRecord) {
    const value = inlineGmp[ipo.id];
    if (value === "" || value === undefined) return;

    const gmp = Number(value);
    if (isNaN(gmp)) {
      alert("Invalid GMP");
      return;
    }

    try {
      const { historyError } = await updateGmpAction(ipo.id, gmp);
      if (historyError) {
        console.warn("GMP history issue:", historyError);
        setToast("GMP updated (history not saved)");
      } else {
        setToast("GMP updated successfully");
      }
    } catch (err: any) {
      console.error("GMP update error:", err);
      alert(err.message || "Failed to update GMP");
      return;
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

    try {
      await saveBrokerAction(editingBroker);
      setShowBrokerForm(false);
      setEditingBroker(null);
      fetchBrokers();
    } catch (e: any) {
      alert(e.message || "Failed to save broker");
    }
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
              className={`px-4 py-2 -mb-px border-b-2 ${tab === t.id
                ? "border-black font-semibold"
                : "border-transparent text-gray-500 dark:text-slate-400"
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
          {/* FinAPI Autonomous Ingestion & Refresh Monitor */}
          <div className="bg-[#111418] text-[#F1F3F5] rounded-lg p-5 shadow-xs border border-[#252A31] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Autonomous Ingestion Engine Active
                </span>
                <span className="text-[11px] bg-[#171B20] text-gray-300 px-2 py-0.5 rounded border border-[#252A31]">
                  FinAPI Upvaly Quota
                </span>
              </div>
              <h2 className="text-base font-semibold tracking-tight text-[#F1F3F5]">
                Live Market Data &amp; Daily Auto-Discovery
              </h2>
              <p className="text-xs text-gray-400">
                Subscriptions auto-refreshed every 30m • GMP refreshed every 1h • New IPOs auto-added
              </p>
              {syncStatus?.lastSyncAt && (
                <p className="text-[11px] text-blue-300/80 pt-0.5">
                  Last Synced: {new Date(syncStatus.lastSyncAt).toLocaleString("en-IN")} • Quota remaining:{" "}
                  {syncStatus.rateLimit?.remainingEndpoint ?? "30"}/30 req/min
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerFinapiSync("subs")}
                disabled={syncing}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#111827]/10 hover:bg-white dark:bg-[#111827]/20 text-white border border-white/20 transition-all disabled:opacity-50"
              >
                Sync Subscriptions (30m)
              </button>
              <button
                onClick={() => handleTriggerFinapiSync("gmp")}
                disabled={syncing}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#111827]/10 hover:bg-white dark:bg-[#111827]/20 text-white border border-white/20 transition-all disabled:opacity-50"
              >
                Sync GMP (1h)
              </button>
              <button
                onClick={() => handleTriggerFinapiSync("all")}
                disabled={syncing}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {syncing ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Run Full Sync Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IPO Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Total IPOs</div>
              <div className="text-xl font-semibold">{ipos.length}</div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Open IPOs</div>
              <div className="text-xl font-semibold">
                {ipos.filter((i) => i.status === "Open").length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Listed IPOs</div>
              <div className="text-xl font-semibold">
                {ipos.filter((i) => i.status === "Listed").length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Upcoming IPOs</div>
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
              <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-slate-300">
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
                    <td colSpan={8} className="p-6 text-center text-gray-500 dark:text-slate-400">
                      Loading IPO data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500 dark:text-slate-400">
                      No IPOs found. Try adjusting filters or add a new IPO.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ipo) => (
                    <tr key={ipo.id} className="border-t hover:bg-gray-50 dark:bg-[#0f172a]">
                      <td className="p-3 font-medium">{ipo.name}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs ${ipo.ipo_type === "SME"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {ipo.ipo_type ?? "-"}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusClass(ipo.status ?? null)}`}>
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
                                ipo.allotment_status ?? null
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
                          className="text-gray-700 dark:text-slate-300 hover:underline"
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
                          onClick={() => deleteIpo(ipo.id, ipo.name ?? undefined)}
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
              <div className="text-sm text-gray-500 dark:text-slate-400">Total Brokers</div>
              <div className="text-xl font-semibold">{brokers.length}</div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Active Brokers</div>
              <div className="text-xl font-semibold">
                {brokers.filter((b) => b.is_active !== false).length}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500 dark:text-slate-400">Inactive</div>
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
              <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-slate-300">
                <tr>
                  <th className="p-3 text-left">Broker</th>
                  <th>Delivery</th>
                  <th>Intraday</th>
                  <th>Status</th>
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
                    <tr key={b.id} className="border-t hover:bg-gray-50 dark:bg-[#0f172a]">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td>{b.equity_delivery ?? "-"}</td>
                      <td>{b.equity_intraday ?? "-"}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${b.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-slate-400'}`}>
                          {b.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>

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
                          onClick={() => deleteBroker(b.id as string, b.name ?? undefined)}
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
        <div className="border rounded-lg p-6 bg-gray-50 dark:bg-[#0f172a]">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6">
          <div className="relative flex h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white dark:bg-[#111827] shadow-xl sm:h-[calc(100vh-3rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-xl font-semibold">
                {editingIpo ? "Edit IPO" : "Add IPO"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 dark:text-slate-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <AdminForm
                ipo={editingIpo}
                onClose={() => {
                  setShowForm(false);
                  fetchIpos();
                }}
              />
            </div>
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
export type BrokerListItem = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  account_opening: string | null;
  account_maintenance: string | null;
  equity_delivery: string | null;
  equity_intraday: string | null;
  futures: string | null;
  options: string | null;
  cta_url: string | null;
  notes: string | null;
};

function valueOrDash(value: string | null) {
  if (!value || !value.trim()) return "—";
  return value;
}

export default function BrokerCard({ broker }: { broker: BrokerListItem }) {
  return (
    <div className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl overflow-hidden h-full hover:border-[#3B82F6]/50 transition-colors shadow-xs">
      <div className="px-5 py-3.5 border-b border-[#f8fafc] dark:border-[#22304A]">
        <h3 className="text-[1.05rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
          {broker.name}
        </h3>
        <p className="text-[11px] text-[#94a3b8] dark:text-[#64748B] mt-0.5">
          Core charges snapshot
        </p>
      </div>

      <div className="px-5 py-4 grid grid-cols-2 gap-x-5 gap-y-3.5">
        {[
          { label: "Account Opening", value: valueOrDash(broker.account_opening) },
          { label: "Account Maintenance", value: valueOrDash(broker.account_maintenance) },
          { label: "Equity Delivery", value: valueOrDash(broker.equity_delivery) },
          { label: "Equity Intraday", value: valueOrDash(broker.equity_intraday) },
          { label: "Futures", value: valueOrDash(broker.futures) },
          { label: "Options", value: valueOrDash(broker.options) },
        ].map((row) => (
          <div key={row.label}>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#94a3b8] dark:text-[#64748B] mb-1">
              {row.label}
            </p>
            <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-[#f8fafc] dark:border-[#22304A] bg-[#fafbfd] dark:bg-[#0D1525] flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-[#64748b] dark:text-[#94A3B8] truncate">
          {valueOrDash(broker.notes)}
        </p>
        {broker.cta_url ? (
          <a
            href={broker.cta_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs shrink-0"
          >
            Open Account
          </a>
        ) : (
          <span className="inline-flex items-center justify-center bg-[#e2e8f0] dark:bg-[#162238] text-[#64748b] dark:text-[#94A3B8] text-[12px] font-semibold px-3.5 py-1.5 rounded-lg shrink-0">
            —
          </span>
        )}
      </div>
    </div>
  );
}

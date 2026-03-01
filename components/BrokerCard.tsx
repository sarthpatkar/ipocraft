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
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-[#f8fafc]">
        <h3 className="text-[1.1rem] font-semibold text-[#0f172a] leading-tight">
          {broker.name}
        </h3>
        <p className="text-[11px] text-[#94a3b8] mt-1">
          Core charges snapshot
        </p>
      </div>

      <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {[
          { label: "Account Opening", value: valueOrDash(broker.account_opening) },
          { label: "Account Maintenance", value: valueOrDash(broker.account_maintenance) },
          { label: "Equity Delivery", value: valueOrDash(broker.equity_delivery) },
          { label: "Equity Intraday", value: valueOrDash(broker.equity_intraday) },
          { label: "Futures", value: valueOrDash(broker.futures) },
          { label: "Options", value: valueOrDash(broker.options) },
        ].map((row) => (
          <div key={row.label}>
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#94a3b8] mb-1.5">
              {row.label}
            </p>
            <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-3.5 border-t border-[#f8fafc] bg-[#fafbfd] flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-[#64748b] truncate">
          {valueOrDash(broker.notes)}
        </p>
        {broker.cta_url ? (
          <a
            href={broker.cta_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1a327a] text-white text-[12px] font-semibold px-4 py-1.5 rounded-[4px] transition-colors duration-150 shrink-0"
          >
            Open Account
          </a>
        ) : (
          <span className="inline-flex items-center justify-center bg-[#e2e8f0] text-[#64748b] text-[12px] font-semibold px-4 py-1.5 rounded-[4px] shrink-0">
            —
          </span>
        )}
      </div>
    </div>
  );
}

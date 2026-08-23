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
    <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg overflow-hidden h-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-xs">
      <div className="px-5 py-3.5 border-b border-gray-100 dark:border-[#252A31]">
        <h3 className="text-[1.05rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
          {broker.name}
        </h3>
        <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
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
            <p className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA] mb-0.5">
              {row.label}
            </p>
            <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 dark:border-[#252A31] bg-gray-50/50 dark:bg-[#171B20] flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-gray-600 dark:text-[#9AA1AA] truncate">
          {valueOrDash(broker.notes)}
        </p>
        {broker.cta_url ? (
          <a
            href={broker.cta_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1a327a] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-md transition-colors shadow-xs shrink-0"
          >
            Open Account
          </a>
        ) : (
          <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-[#171B20] text-gray-500 dark:text-[#9AA1AA] text-[12px] font-semibold px-3.5 py-1.5 rounded-md shrink-0">
            -
          </span>
        )}
      </div>
    </div>
  );
}

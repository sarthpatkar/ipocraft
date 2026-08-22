export default function SubscriptionsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-8 w-52 rounded-lg" />
      <div className="skeleton h-4 w-80 rounded" />
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[#f1f5f9] dark:border-[#1e293b]">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-4 w-14 rounded" />
            <div className="skeleton h-4 w-14 rounded" />
            <div className="skeleton h-4 w-14 rounded" />
            <div className="skeleton h-4 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

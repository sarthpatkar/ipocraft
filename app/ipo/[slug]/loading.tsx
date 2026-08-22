export default function IpoDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 sm:p-8 space-y-4">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-8 w-2/3 rounded-lg" />
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
      </div>
      {/* GMP Chart */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 space-y-3">
        <div className="skeleton h-4 w-28 rounded" />
        <div className="skeleton h-48 rounded-lg" />
      </div>
      {/* Timeline */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

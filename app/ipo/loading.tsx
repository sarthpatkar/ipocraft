export default function IpoListLoading() {
  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-20 rounded-full" />
        ))}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton h-5 w-14 rounded-full" />
            </div>
            <div className="skeleton h-3 w-24 rounded" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="skeleton h-10 rounded" />
              <div className="skeleton h-10 rounded" />
              <div className="skeleton h-10 rounded" />
            </div>
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

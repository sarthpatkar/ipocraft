export default function GmpLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="skeleton h-4 w-72 rounded" />
      {/* Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden">
        <div className="grid gap-0">
          <div className="skeleton h-10 w-full" style={{ borderRadius: 0 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[#f1f5f9] dark:border-[#1e293b]">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

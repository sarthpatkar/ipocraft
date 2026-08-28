export default function CompareLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mb-8 space-y-3 animate-pulse">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-8 w-72 rounded-lg" />
          <div className="skeleton h-4 w-full max-w-lg rounded" />
        </div>
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5 animate-pulse">
          <div className="skeleton h-3 w-40 rounded mb-3" />
          <div className="skeleton h-9 w-64 rounded-lg" />
        </div>
      </div>
    </main>
  );
}

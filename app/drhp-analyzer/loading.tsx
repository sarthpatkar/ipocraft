export default function DRHPAnalyzerLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] pb-20">
      <div className="bg-amber-50/60 dark:bg-amber-950/10 border-b border-amber-100 dark:border-amber-900/20 h-10" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-4 animate-pulse">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton h-8 w-80 max-w-full rounded-lg" />
        <div className="skeleton h-4 w-full max-w-md rounded" />
        <div className="skeleton h-32 w-full rounded-xl mt-6" />
      </div>
    </main>
  );
}

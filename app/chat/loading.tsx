export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090B0F] flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 space-y-4 animate-pulse flex-1">
        <div className="skeleton h-7 w-64 rounded-lg" />
        <div className="skeleton h-4 w-full max-w-sm rounded" />
        <div className="space-y-3 pt-6">
          <div className="skeleton h-16 w-3/4 rounded-2xl" />
          <div className="skeleton h-12 w-2/3 rounded-2xl ml-auto" />
          <div className="skeleton h-20 w-4/5 rounded-2xl" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-8 pt-4">
        <div className="skeleton h-12 w-full rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">IPOCraft</h1>
        <div className="space-x-6 text-sm">
          <a href="#" className="hover:text-blue-400">Upcoming IPO</a>
          <a href="#" className="hover:text-blue-400">GMP</a>
          <a href="#" className="hover:text-blue-400">SME IPO</a>
          <a href="#" className="hover:text-blue-400">News</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Crafting Smarter IPO Insights
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Get latest IPO GMP, subscription data, SME IPO insights, and upcoming IPO alerts for Indian investors.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
          Explore IPOs
        </button>
      </section>

      {/* Cards */}
      <section className="grid md:grid-cols-3 gap-6 px-6 pb-20 max-w-6xl mx-auto">

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Upcoming IPO</h3>
          <p className="text-gray-400 text-sm">
            Track upcoming IPO launches with complete details.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">IPO GMP</h3>
          <p className="text-gray-400 text-sm">
            Latest grey market premium updates and trends.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">SME IPO</h3>
          <p className="text-gray-400 text-sm">
            SME IPO analysis and subscription insights.
          </p>
        </div>

      </section>

    </main>
  );
}
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to The Bazaar
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Discover thousands of products from trusted vendors
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Shop</h2>
            <p className="text-slate-300">Browse our marketplace</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Sell</h2>
            <p className="text-slate-300">Become a vendor</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Track</h2>
            <p className="text-slate-300">Track your orders</p>
          </div>
        </div>
      </div>
    </main>
  )
}

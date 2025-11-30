export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-purple-900 mb-6">
          Admin Portal
        </h1>
        <p className="text-xl text-purple-700 mb-8">
          Manage The Bazaar platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Dashboard</h2>
            <p className="text-purple-700">Platform overview and analytics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Vendors</h2>
            <p className="text-purple-700">Manage vendors and approvals</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Orders</h2>
            <p className="text-purple-700">Monitor all orders</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          Vendor Portal
        </h1>
        <p className="text-xl text-blue-700 mb-8">
          Manage your store, products, and orders
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Dashboard</h2>
            <p className="text-blue-700">View your store analytics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Products</h2>
            <p className="text-blue-700">Manage your inventory</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Orders</h2>
            <p className="text-blue-700">Track customer orders</p>
          </div>
        </div>
      </div>
    </main>
  )
}

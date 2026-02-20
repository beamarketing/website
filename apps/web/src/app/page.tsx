export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Documents Indexed</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Active Insights</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Conversations</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold mb-2">Recent Insights</h3>
        <p className="text-sm text-gray-500">
          No insights yet. Connect a data source to get started.
        </p>
      </div>
    </div>
  );
}

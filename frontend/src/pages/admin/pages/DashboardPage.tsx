import StatsCard from "../../../components/admin/dashboard/StatsCard";
import SalesChart from "../../../components/admin/dashboard/SalesChart";
import { Package, ShoppingCart, Users, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Products" value="72" icon={<Package className="w-6 h-6" />} />
        <StatsCard title="Revenues" value="$5,732" icon={<ShoppingCart className="w-6 h-6" />} />
        <StatsCard title="Users" value="72" icon={<Users className="w-6 h-6" />} />
        <StatsCard title="Pending Orders" value="10" icon={<Clock className="w-6 h-6" />} />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
        <SalesChart />
      </div>
    </div>
  );
}

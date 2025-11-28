import StatsCard from "../../../components/admin/dashboard/StatsCard";
import SalesChart from "../../../components/admin/dashboard/SalesChart";
import { Package, ShoppingCart, Users, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 ">
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Products" value="72" icon={<Package />} />
        <StatsCard title="Revenues" value="$5,732" icon={<ShoppingCart />} />
        <StatsCard title="Users" value="72" icon={<Users />} />
        <StatsCard title="Pending Orders" value="10" icon={<Clock />} />
      </div>

      {/* Chart */}
      <SalesChart />
    </div>
  );
}

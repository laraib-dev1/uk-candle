import { useEffect, useState } from "react";
import StatsCard from "../../../components/admin/dashboard/StatsCard";
import SalesChart from "../../../components/admin/dashboard/SalesChart";
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3
} from "lucide-react";
import { fetchOrders } from "@/api/order.api";
import { getProducts } from "@/api/product.api";
import { getAllReviews } from "@/api/review.api";
import { getQueries } from "@/api/query.api";
import {
  processOrdersForNotifications,
  processReviewsForNotifications,
  processQueriesForNotifications,
} from "@/utils/adminNotifications";
import PageLoader from "@/components/ui/PageLoader";

interface DashboardStats {
  products: number;
  revenue: number;
  allOrders: number;
  completeOrders: number;
  canceledOrders: number;
  pendingOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    revenue: 0,
    allOrders: 0,
    completeOrders: 0,
    canceledOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const products = await getProducts();
        const productsCount = products.length;

        // Fetch orders
        const orders = await fetchOrders();
        const mappedOrders = Array.isArray(orders) ? orders.map((o: any) => ({ ...o, id: o._id })) : [];
        processOrdersForNotifications(mappedOrders);
        const allOrdersCount = mappedOrders.length;

        // Fetch reviews and queries for notifications (run in parallel)
        Promise.all([
          getAllReviews()
            .then((reviews) => processReviewsForNotifications(Array.isArray(reviews) ? reviews : []))
            .catch(() => {}),
          getQueries()
            .then((data) => {
              const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
              processQueriesForNotifications(list);
            })
            .catch(() => {}),
        ]);

        // Calculate revenue (sum of all completed orders)
        const revenue = mappedOrders
          .filter((order: any) => order.status?.toLowerCase() === "complete")
          .reduce((sum: number, order: any) => sum + (order.bill || 0), 0);

        // Count orders by status
        const completeOrders = mappedOrders.filter(
          (order: any) => order.status?.toLowerCase() === "complete"
        ).length;

        const canceledOrders = mappedOrders.filter(
          (order: any) => order.status?.toLowerCase() === "cancel" || order.status?.toLowerCase() === "cancelled"
        ).length;

        const pendingOrders = mappedOrders.filter(
          (order: any) => order.status?.toLowerCase() === "pending"
        ).length;

        setStats({
          products: productsCount,
          revenue: Math.round(revenue),
          allOrders: allOrdersCount,
          completeOrders,
          canceledOrders,
          pendingOrders,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Dashboard Title */}
      <h1 className="text-2xl font-semibold theme-heading mb-4">Dashboard</h1>

      {/* Stats Cards - 2x4 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Products" 
          value={loading ? "..." : formatNumber(stats.products)} 
          icon={<BarChart3 className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Revenue" 
          value={loading ? "..." : formatCurrency(stats.revenue)} 
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Label" 
          value="72" 
          icon={<BarChart3 className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Label" 
          value="72" 
          icon={<BarChart3 className="w-5 h-5" />} 
        />
        <StatsCard 
          title="All Orders" 
          value={loading ? "..." : formatNumber(stats.allOrders)} 
          icon={<ShoppingBag className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Complete Orders" 
          value={loading ? "..." : formatNumber(stats.completeOrders)} 
          icon={<CheckCircle className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Canceled Orders" 
          value={loading ? "..." : formatNumber(stats.canceledOrders)} 
          icon={<XCircle className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Pending Orders" 
          value={loading ? "..." : formatNumber(stats.pendingOrders)} 
          icon={<Clock className="w-5 h-5" />} 
        />
      </div>

      {/* Chart */}
      <div className="w-full">
        <SalesChart />
      </div>
    </div>
  );
}

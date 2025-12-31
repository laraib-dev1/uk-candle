import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { fetchOrders } from "../../../api/order.api";
import { Input } from "@/components/ui/input";
import { OrderModal } from "../product/OrderModal";
import PageLoader from "@/components/ui/PageLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterTabs from "@/components/ui/FilterTabs";
interface Address {
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  area?: string;
  postalCode: string;
  phone: string;
  line1: string;
}

interface Order {
  _id: string;
  id?: string;
  customerName: string;
  address: Address;
  phoneNumber: string;
  items: { name: string; quantity: number; price: number }[];
  type: string;
  bill: number;
  payment: string;
  status: string;
  createdAt: string;
}


export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "cancel" | "complete" | "Returned">("All");
  const [modalOpen, setModalOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

const openView = (order: Order) => {
  setSelectedOrder(order);
  setModalOpen(true);
};

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
const loadOrders = async () => {
  setLoading(true);
  try {
    const data = await fetchOrders();
    const mapped = data.map((o: Order) => ({ ...o, id: o._id }));
    setOrders(mapped);
    setFilteredOrders(mapped);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
  setLoading(false);
};
useEffect(() => {
  loadOrders();
}, []);

  // Fetch orders
  // useEffect(() => {
  //   const getOrders = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchOrders();
  //       const mapped = data.map((o: Order) => ({ ...o, id: o._id }));
  //       setOrders(mapped);
  //       setFilteredOrders(mapped);
  //     } catch (err) {
  //       console.error("Error fetching orders:", err);
  //     }
  //     setLoading(false);
  //   };
  //   getOrders();
  // }, []);

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter orders by tab and search
  useEffect(() => {
    let data = [...orders];

    // Filter by tab
    if (selectedTab !== "All") {
      data = data.filter(order => order.status.toLowerCase() === selectedTab.toLowerCase());
    }

    // Filter by search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(order => 
        order.customerName.toLowerCase().includes(s) ||
        order.phoneNumber.toLowerCase().includes(s)
      );
    }

    setFilteredOrders(data);
  }, [orders, selectedTab, search]);

  const getColumns = () => {
    const allColumns = [
      {
        name: "ID",
        cell: (_row: Order, index: number) => <span className="text-gray-600">#{index + 1}</span>,
        minWidth: "60px",
      },
      {
        name: "Customer",
        heading: (row: Order) => row.customerName,
        subInfo: (row: Order) => {
          if (!row.address) return "N/A";
          const parts = [
            row.address.line1,
            row.address.area,
            row.address.city,
            row.address.province,
            row.address.postalCode
          ].filter(Boolean);
          return parts.join(", ");
        },
        minWidth: "200px",
      },
      {
        name: "Items",
        heading: (row: Order) => row.items.map(i => `${i.name} x ${i.quantity}`).join(", "),
        subInfo: (row: Order) => row.type,
        minWidth: "200px",
      },
      {
        name: "Bill",
        heading: (row: Order) => `$${row.bill}`,
        subInfo: (row: Order) => row.payment,
        minWidth: "150px",
      },
      {
        name: "Created At",
        selector: (row: Order) => new Date(row.createdAt).toLocaleString(),
        minWidth: "150px",
      },
      {
        name: "Status",
        cell: (row: Order) => <StatusBadge status={row.status} type="order" />,
        minWidth: "100px",
      },
    ];

    if (windowWidth < 640) {
      // small screens: show only most important (ID, Customer, Bill, Created At, Status)
      return allColumns.filter((_, idx) => [0, 1, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 800) {
      // medium-small screens
      return allColumns.filter((_, idx) => [0, 1, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 1024) {
      // medium screens
      return allColumns.filter((_, idx) => [0, 1, 2, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 1250) {
      // large-medium screens
      return allColumns.filter((_, idx) => [0, 1, 2, 3, 4, 5].includes(idx));
    }

    // large screens: show all
    return allColumns;
  };

  if (loading && orders.length === 0) {
    return <PageLoader message="Loading orders..." />;
  }

  return (
    <div className="w-full">
      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        {/* Tabs */}
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-semibold theme-heading text-black">Orders</h2>
          <FilterTabs
            tabs={[
              { value: "All", label: "All" },
              { value: "cancel", label: "Cancel" },
              { value: "complete", label: "Complete" },
              { value: "Returned", label: "Returned" },
            ]}
            value={selectedTab}
            onChange={(value) => setSelectedTab(value as any)}
          />
        </div>

        {/* Search */}
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <Input
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64 text-black"
          />
        </div>
      </div>
      <OrderModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={loadOrders}
      />
      {/* EnhancedDataTable */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-visible">
        <EnhancedDataTable<Order>
          columns={getColumns()}
          data={filteredOrders}
          onView={openView}
          pagination
        />
      </div>
    </div>
  );

}

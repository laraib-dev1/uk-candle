import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { fetchOrders } from "../../../api/order.api";
import { Input } from "@/components/ui/input";
import { OrderModal } from "../product/OrderModal";
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
        name: "Order",
        heading: (row: Order) => `Order #${row._id?.substring(0, 8) || "N/A"}`,
        subInfo: (row: Order) => new Date(row.createdAt).toLocaleDateString(),
        minWidth: "180px",
      },
      {
        name: "Customer",
        heading: (row: Order) => row.customerName,
        subInfo: (row: Order) => row.phoneNumber,
        minWidth: "200px",
      },
      {
        name: "Address",
        selector: (row: Order) =>
          row.address
            ? `${row.address.line1}, ${row.address.city}, ${row.address.province}`
            : "N/A",
        minWidth: "250px",
      },
      {
        name: "Items",
        selector: (row: Order) => `${row.items.length} item(s)`,
        minWidth: "120px",
      },
      {
        name: "Amount",
        heading: (row: Order) => `$${row.bill}`,
        subInfo: (row: Order) => row.payment,
        minWidth: "150px",
      },
      {
        name: "Status",
        cell: (row: Order) => {
          const statusColors: Record<string, string> = {
            complete: "bg-green-100 text-green-800",
            cancel: "bg-red-100 text-red-800",
            returned: "bg-yellow-100 text-yellow-800",
            pending: "bg-blue-100 text-blue-800",
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[row.status.toLowerCase()] || "bg-gray-100 text-gray-800"
            }`}>
              {row.status}
            </span>
          );
        },
        minWidth: "120px",
      },
    ];

    // Breakpoints: 600px, 800px, 900px, 1000px, 1200px, 2040px
    if (windowWidth < 600) {
      // Very small screens: Order, Customer, Amount, Status, Actions
      return allColumns.filter((_, idx) => [0, 1, 4, 5].includes(idx));
    }

    if (windowWidth < 800) {
      // Small screens: Order, Customer, Amount, Status, Actions
      return allColumns.filter((_, idx) => [0, 1, 4, 5].includes(idx));
    }

    if (windowWidth < 900) {
      // Medium-small screens: Order, Customer, Items, Amount, Status, Actions
      return allColumns.filter((_, idx) => [0, 1, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 1000) {
      // Medium screens: Order, Customer, Items, Amount, Status, Actions
      return allColumns.filter((_, idx) => [0, 1, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 1200) {
      // Large-medium screens: Order, Customer, Address, Items, Amount, Status, Actions
      return allColumns.filter((_, idx) => [0, 1, 2, 3, 4, 5].includes(idx));
    }

    // Extra large screens (1200px+): All columns
    return allColumns;
  };

 return (
  <div className="w-full">
    {/* Tabs + Search */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <h2 className="text-2xl font-semibold theme-heading mr-4">Orders</h2>
        {["All", "cancel", "complete", "Returned"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-full border ${
              selectedTab === tab ? "text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            style={selectedTab === tab ? { backgroundColor: "var(--theme-primary)" } : {}}
            onClick={() => setSelectedTab(tab as any)}
          >
            {tab}
          </button>
        ))}
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
  onUpdate={loadOrders} // refresh after status update
/>
    {/* DataTable */}
    <div className="bg-white shadow-md rounded-lg border border-gray-200">
      <EnhancedDataTable<Order>
        columns={getColumns()}
        data={filteredOrders}
        onView={openView}
        pagination
      />
    </div>

    {loading && <p className="text-gray-500 mt-2">Loading orders...</p>}
  </div>
);

}

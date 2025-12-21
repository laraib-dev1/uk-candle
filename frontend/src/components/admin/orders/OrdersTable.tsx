import React, { useEffect, useState } from "react";
import DataTable from "../../../pages/admin/components/table/DataTable";
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
          { name: "Customer", selector: (row: Order) => row.customerName, sortable: true },
    {
  name: "Address",
  selector: (row: Order) =>
    row.address
      ? `${row.address.line1}, ${row.address.area || ""}, ${row.address.city}, ${row.address.province}, ${row.address.postalCode}`
      : "N/A",
  sortable: true,
},
    { name: "Phone Number", selector: (row: Order) => row.phoneNumber, sortable: true },
    {
      name: "Items",
      selector: (row: Order) => row.items.map(i => `${i.name} x ${i.quantity}`).join(", "),
      sortable: false,
    },
    { name: "Type", selector: (row: Order) => row.type, sortable: true },
    { name: "Bill", selector: (row: Order) => `$${row.bill}`, sortable: true },
    { name: "Payment", selector: (row: Order) => row.payment, sortable: true },
    { name: "Status", selector: (row: Order) => row.status, sortable: true },
    { name: "Created At", selector: (row: Order) => new Date(row.createdAt).toLocaleString(), sortable: true },
    {
  name: "Action",
  cell: (row: Order) => (
    <button
      className="theme-button px-2 py-1 rounded"
      onClick={() => openView(row)}
    >
      View
    </button>
  ),
  sortable: false,
}

  ];

     if (windowWidth < 640) {
    // small screens: show only most important
    return allColumns.filter(c => ["Customer", "Bill", "Status", "Action"].includes(c.name));
  }

  if (windowWidth <786) {
    // medium screens: show a few more columns
    return allColumns.filter(c => ["Customer", "Bill", "Status", "Action"].includes(c.name));
  }
  if (windowWidth < 800) {
    return allColumns.filter(c => ["Customer", "Bill", "Status", "Action"].includes(c.name));
  }
  if (windowWidth < 1024) {
    // small screens: show only most important
    return allColumns.filter(c => ["Customer", "Bill", "Status", "Action"].includes(c.name));
  }

  if (windowWidth <1250) {
    // medium screens: show a few more columns
    return allColumns.filter(c => ["Customer", "Phone Number", "Bill", "Status"].includes(c.name));
  }
  // large screens: show all
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
    <DataTable<Order>
      columns={getColumns()}
      data={filteredOrders}
      pagination
      dense
      responsive
      selectable={false}
      className="shadow-md rounded-lg"
    />

    {loading && <p className="text-gray-500 mt-2">Loading orders...</p>}
  </div>
);

}

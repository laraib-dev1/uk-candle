import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { fetchOrders } from "../../../api/order.api";
import { Input } from "@/components/ui/input";
import { OrderModal } from "../product/OrderModal";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterTabs from "@/components/ui/FilterTabs";
/** Show at most maxWords then "...." (full text in title for hover) */
function truncateWords(str: string, maxWords = 3): string {
  if (!str || typeof str !== "string") return str;
  const trimmed = str.trim();
  if (!trimmed) return trimmed;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(" ") + " ....";
}

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
        name: "SR",
        cell: (_row: Order, index: number) => (
          <div className="w-12 min-w-0 flex justify-center" style={{ maxWidth: "60px" }}>
            <span className="text-gray-600">{index + 1}</span>
          </div>
        ),
        minWidth: "60px",
        maxWidth: "60px",
        width: "60px",
      },
      {
        name: "Customer",
        cell: (row: Order) => {
          const name = row.customerName || "";
          const phone = row.phoneNumber || "";
          return (
            <div className="py-1">
              <div className="font-medium text-gray-900 truncate" title={name}>
                {truncateWords(name, 3)}
              </div>
              <div className="text-sm text-gray-500 truncate" title={phone}>
                {truncateWords(phone, 3)}
              </div>
            </div>
          );
        },
        minWidth: "120px",
      },
      {
        name: "Address",
        cell: (row: Order) => {
          if (!row.address) {
            return <div className="py-1 text-sm text-gray-500">N/A</div>;
          }
          const a = row.address;
          const parts = [a.line1, a.area, a.city, a.province].filter(Boolean);
          const addressText = parts.join("\n");
          return (
            <div
              className="order-address-cell py-1 text-sm text-gray-900 min-w-0 max-w-[200px]"
              style={{ whiteSpace: "pre-line", overflowWrap: "break-word", display: "block" }}
              title={addressText}
            >
              {addressText}
            </div>
          );
        },
        minWidth: "140px",
      },
      {
        name: "Items",
        cell: (row: Order) => {
          const type = row.type || "";
          const itemsText = row.items.map((i) => `${i.name} x ${i.quantity}`).join("\n");
          return (
            <div
              className="order-items-cell py-1 text-sm text-gray-900 min-w-0 max-w-[200px]"
              style={{ whiteSpace: "pre-line", overflowWrap: "break-word", display: "block" }}
              title={itemsText + (type ? `\n${type}` : "")}
            >
              {itemsText}
              {type && (
                <span className="block text-xs text-gray-500 mt-0.5">{type}</span>
              )}
            </div>
          );
        },
        minWidth: "140px",
      },
      {
        name: "Bill",
        cell: (row: Order) => {
          const bill = `$${Number(row.bill).toFixed(2)}`;
          const payment = row.payment || "";
          return (
            <div className="py-1">
              <div className="font-medium text-gray-900 truncate" title={bill}>
                {bill}
              </div>
              <div className="text-sm text-gray-500 truncate" title={payment}>
                {truncateWords(payment, 3)}
              </div>
            </div>
          );
        },
        minWidth: "100px",
      },
      {
        name: "Status",
        cell: (row: Order) => <StatusBadge status={row.status} type="order" />,
        minWidth: "100px",
      },
      {
        name: "Created At",
        cell: (row: Order) => new Date(row.createdAt).toLocaleDateString(),
        minWidth: "120px",
      },
    ];

    if (windowWidth < 640) {
      // small screens: show only most important
      return allColumns.filter((_, idx) => [0, 1, 4, 5].includes(idx));
    }

    if (windowWidth < 786) {
      // medium screens: show a few more columns
      return allColumns.filter((_, idx) => [0, 1, 4, 5].includes(idx));
    }
    
    if (windowWidth < 800) {
      return allColumns.filter((_, idx) => [0, 1, 4, 5].includes(idx));
    }
    
    if (windowWidth < 1024) {
      // small screens: show only most important
      return allColumns.filter((_, idx) => [0, 1, 3, 4, 5].includes(idx));
    }

    if (windowWidth < 1250) {
      // medium screens: show a few more columns
      return allColumns.filter((_, idx) => [0, 1, 2, 3, 4, 5].includes(idx));
    }
    
    // large screens: show all
    return allColumns;
  };

 return (
  <div className="w-full">
    {/* Tabs + Search */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
      {/* Tabs */}
      <div className="flex gap-4 items-center flex-wrap">
        <h2 className="text-2xl font-semibold theme-heading">Orders</h2>
        <FilterTabs
          tabs={[
            { id: "All", label: "All" },
            { id: "cancel", label: "Cancel" },
            { id: "complete", label: "Complete" },
            { id: "Returned", label: "Returned" },
          ]}
          activeTab={selectedTab}
          onTabChange={(tabId) => setSelectedTab(tabId as any)}
        />
      </div>

      {/* Search */}
      <div className="w-full md:w-auto mt-2 md:mt-0">
        <Input
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 text-gray-900"
          style={{ borderColor: "var(--theme-primary)" }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--theme-primary)";
            e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--theme-primary)";
            e.currentTarget.style.boxShadow = "";
          }}
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
    <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="p-4">
          <DataTableSkeleton rows={8} />
        </div>
      ) : (
        <EnhancedDataTable<Order>
          columns={getColumns()}
          data={filteredOrders}
          onView={openView}
          pagination
        />
      )}
    </div>
  </div>
);

}

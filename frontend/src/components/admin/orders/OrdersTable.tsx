import OrderStatusBadge from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";

// Sample data (replace with API call if needed)
const data = [
  {
    customer: "Noe Pitt",
    phone: "666-773-1378",
    type: "Cash On-delivery",
    bill: "$240",
    status: "paid",
  },
  {
    customer: "Jo Comrie",
    phone: "785-203-1317",
    type: "Pay Online",
    bill: "$130",
    status: "pending",
  },
  {
    customer: "Verna Thiel",
    phone: "456-210-9956",
    type: "Pay Online",
    bill: "$90",
    status: "cancelled",
  },
];

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
        <div className="flex gap-2">
          <Button variant="default" className="bg-orange-500 hover:bg-orange-600 ">
            All
          </Button>
          <Button  variant="outline" className="text-gray-900" >Cancel</Button>
          <Button  variant="outline" className="text-gray-900" >Complete</Button>
          <Button  variant="outline" className="text-gray-900" >Returned</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-gray-900">Customer</th>
              <th className="py-2 px-3 text-gray-900">Phone Number</th>
              <th className="py-2 px-3 text-gray-900">Type</th>
              <th className="py-2 px-3 text-gray-900">Bill</th>
              <th className="py-2 px-3 text-gray-900">Status</th>
              <th className="py-2 px-3 text-gray-900">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-gray-900">
                <td className="py-2 px-3 text-gray-900">{item.customer}</td>
                <td className="py-2 px-3 text-gray-900">{item.phone}</td>
                <td className="py-2 px-3 text-gray-900">{item.type}</td>
                <td className="py-2 px-3 text-gray-900">{item.bill}</td>
                <td className="py-2 px-3 text-gray-900">
                  <OrderStatusBadge status={item.status} />
                </td>
                <td className="py-2 px-3">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-gray-600">Showing 1 to 10 of {data.length} entries</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">1</Button>
          <Button variant="ghost" size="sm">2</Button>
          <Button variant="ghost" size="sm">3</Button>
          <Button variant="ghost" size="sm">...</Button>
          <Button variant="ghost" size="sm">10</Button>
        </div>
      </div>
    </div>
  );
}

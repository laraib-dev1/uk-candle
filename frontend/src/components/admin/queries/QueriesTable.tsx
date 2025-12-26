import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { getQueries, updateQueryStatus, deleteQuery } from "../../../api/query.api";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Trash2, Eye } from "lucide-react";

interface Query {
  _id: string;
  id?: string;
  email: string;
  subject: string;
  description: string;
  status: "Pending" | "Read" | "Replied";
  createdAt: string;
}

export default function QueriesTable() {
  const { success, error } = useToast();
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "Pending" | "Read" | "Replied">("All");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const loadQueries = async () => {
    setLoading(true);
    try {
      const data = await getQueries();
      const mapped = data.map((q: Query) => ({ ...q, id: q._id }));
      setQueries(mapped);
      setFilteredQueries(mapped);
    } catch (err) {
      console.error("Error fetching queries:", err);
      error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter queries by tab and search
  useEffect(() => {
    let data = [...queries];

    // Filter by tab
    if (selectedTab !== "All") {
      data = data.filter(query => query.status === selectedTab);
    }

    // Filter by search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(query => 
        query.email.toLowerCase().includes(s) ||
        query.subject.toLowerCase().includes(s) ||
        query.description.toLowerCase().includes(s)
      );
    }

    setFilteredQueries(data);
  }, [queries, selectedTab, search]);

  const handleStatusChange = async (id: string, newStatus: "Pending" | "Read" | "Replied") => {
    try {
      await updateQueryStatus(id, newStatus);
      success("Query status updated successfully");
      loadQueries();
    } catch (err: any) {
      error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteQuery(deleteConfirm);
      success("Query deleted successfully");
      setDeleteConfirm(null);
      loadQueries();
    } catch (err: any) {
      error(err?.response?.data?.message || "Failed to delete query");
      setDeleteConfirm(null);
    }
  };

  const openView = (query: Query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const getColumns = () => {
    const allColumns = [
      {
        name: "Email",
        heading: (row: Query) => row.email,
        subInfo: (row: Query) => new Date(row.createdAt).toLocaleDateString(),
        minWidth: "200px",
      },
      {
        name: "Subject",
        selector: (row: Query) => row.subject,
        minWidth: "250px",
      },
      {
        name: "Description",
        selector: (row: Query) => row.description.length > 50 
          ? `${row.description.substring(0, 50)}...` 
          : row.description,
        minWidth: "300px",
      },
      {
        name: "Status",
        cell: (row: Query) => {
          const statusColors: Record<string, string> = {
            Pending: "bg-yellow-100 text-yellow-800",
            Read: "bg-blue-100 text-blue-800",
            Replied: "bg-green-100 text-green-800",
          };
          return (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row._id, e.target.value as "Pending" | "Read" | "Replied")}
              className={`px-2 py-1 rounded-full text-xs font-medium border-none ${statusColors[row.status] || "bg-gray-100 text-gray-800"}`}
              style={{ backgroundColor: "inherit", color: "inherit" }}
            >
              <option value="Pending">Pending</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
            </select>
          );
        },
        minWidth: "120px",
      },
      {
        name: "Actions",
        cell: (row: Query) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openView(row)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
        minWidth: "100px",
      },
    ];

    // Breakpoints: 600px, 800px, 900px, 1000px, 1200px, 2040px
    if (windowWidth < 600) {
      return allColumns.filter((_, idx) => [0, 2, 3, 4].includes(idx));
    }

    if (windowWidth < 800) {
      return allColumns.filter((_, idx) => [0, 1, 3, 4].includes(idx));
    }

    if (windowWidth < 1000) {
      return allColumns.filter((_, idx) => [0, 1, 3, 4].includes(idx));
    }

    return allColumns;
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Query"
        message="Are you sure you want to delete this query? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold theme-heading">Queries</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["All", "Pending", "Read", "Replied"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={
              selectedTab === tab
                ? {
                    backgroundColor: "var(--theme-primary)",
                    color: "white",
                    borderBottom: "2px solid var(--theme-primary)",
                  }
                : { color: "var(--theme-dark)" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <EnhancedDataTable
        data={filteredQueries}
        columns={getColumns()}
      />

      {/* View Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold theme-heading">Query Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedQuery.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <p className="text-gray-900">{selectedQuery.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedQuery.description}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    value={selectedQuery.status}
                    onChange={(e) => {
                      handleStatusChange(selectedQuery._id, e.target.value as "Pending" | "Read" | "Replied");
                      setSelectedQuery({ ...selectedQuery, status: e.target.value as "Pending" | "Read" | "Replied" });
                    }}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedQuery.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


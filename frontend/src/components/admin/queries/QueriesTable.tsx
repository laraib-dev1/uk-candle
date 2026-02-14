import React, { useState, useEffect } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterTabs from "@/components/ui/FilterTabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getQueries, updateQueryStatus } from "@/api/query.api";
import { processQueriesForNotifications } from "@/utils/adminNotifications";
import { useToast } from "@/components/ui/toast";

interface Query {
  id?: string;
  _id?: string;
  name?: string; // legacy
  subject?: string;
  description?: string;
  email: string;
  message?: string; // legacy, use description
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["Pending", "Read", "Replied"] as const;

export default function QueriesTable() {
  const { success, error } = useToast();
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "read" | "pending" | "replied">("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewingQuery, setViewingQuery] = useState<Query | null>(null);

  const loadQueries = async () => {
    setLoading(true);
    try {
      const data = await getQueries();
      const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
      const mapped = list.map((q: any) => ({
        ...q,
        id: q._id || q.id,
      }));
      setQueries(mapped);
      setFilteredQueries(mapped);
      processQueriesForNotifications(mapped);
    } catch (err) {
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleStatusChange = async (queryId: string, newStatus: string) => {
    const id = queryId;
    if (!id || !STATUS_OPTIONS.includes(newStatus as any)) return;
    setUpdatingId(id);
    try {
      await updateQueryStatus(id, newStatus as "Pending" | "Read" | "Replied");
      setQueries((prev) =>
        prev.map((q) => (q._id === id || q.id === id ? { ...q, status: newStatus } : q))
      );
      success("Status updated.");
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter queries by tab and search
  React.useEffect(() => {
    let data = [...queries];

    // Filter by tab
    if (selectedTab !== "All") {
      data = data.filter(query => query.status.toLowerCase() === selectedTab.toLowerCase());
    }

    // Filter by search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(query =>
        (query.name || "").toLowerCase().includes(s) ||
        (query.subject || "").toLowerCase().includes(s) ||
        query.email.toLowerCase().includes(s) ||
        (query.message || query.description || "").toLowerCase().includes(s)
      );
    }

    setFilteredQueries(data);
  }, [queries, selectedTab, search]);

  const getColumns = () => {
    return [
      {
        name: "SR",
        cell: (_row: Query, index: number) => <span className="text-gray-600">{index + 1}</span>,
        minWidth: "60px",
      },
      {
        name: "Subject",
        heading: (row: Query) => row.subject || row.name || "—",
        subInfo: (row: Query) => row.email,
        minWidth: "200px",
      },
      {
        name: "Message",
        cell: (row: Query) => {
          const text = row.description || row.message || "";
          return (
            <div className="py-1">
              <div className="text-sm text-gray-900 line-clamp-2" title={text}>
                {text.length > 50 ? text.substring(0, 50) + "...." : text || "—"}
              </div>
            </div>
          );
        },
        minWidth: "300px",
      },
      {
        name: "Status",
        cell: (row: Query) => (
          <StatusBadge status={row.status || "Pending"} type="query" />
        ),
        minWidth: "100px",
      },
      {
        name: "Created At",
        cell: (row: Query) => new Date(row.createdAt).toLocaleDateString(),
        minWidth: "120px",
      },
    ];
  };

  return (
    <div className="w-full">
      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        {/* Tabs */}
        <div className="flex gap-4 items-center flex-wrap">
          <h2 className="text-2xl font-semibold theme-heading">Queries</h2>
          <FilterTabs
            tabs={[
              { id: "All", label: "All" },
              { id: "read", label: "Read" },
              { id: "pending", label: "Pending" },
              { id: "replied", label: "Replied" },
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

      {/* DataTable */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <DataTableSkeleton rows={8} />
          </div>
        ) : (
          <EnhancedDataTable<Query>
            columns={getColumns()}
            data={filteredQueries}
            pagination
            onView={(row) => setViewingQuery(row)}
          />
        )}
      </div>

      {/* View / Change status dialog */}
      <QueryViewDialog
        query={viewingQuery}
        onClose={() => setViewingQuery(null)}
        onStatusChange={async (id, status) => {
          await handleStatusChange(id, status);
          setViewingQuery(null);
        }}
        updatingId={updatingId}
      />
    </div>
  );
}

function QueryViewDialog({
  query,
  onClose,
  onStatusChange,
  updatingId,
}: {
  query: Query | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  updatingId: string | null;
}) {
  const [selectedStatus, setSelectedStatus] = useState(query?.status || "Pending");
  const open = !!query;
  const id = query?._id || query?.id;

  React.useEffect(() => {
    if (query) setSelectedStatus(query.status || "Pending");
  }, [query?.status]);

  const handleUpdate = () => {
    if (!id) return;
    onStatusChange(id, selectedStatus);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="admin-dialog-content sm:max-w-md bg-white p-0 gap-0 overflow-hidden">
        <DialogHeader className="admin-modal-header flex items-center justify-between text-left px-6 py-4 rounded-t-lg shrink-0">
          <div>
            <DialogTitle className="text-white font-semibold">Query</DialogTitle>
            <DialogDescription className="text-white/90">View details and update status</DialogDescription>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded text-white hover:bg-white/20 transition-colors shrink-0" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        {query && (
          <div className="px-6 py-4 space-y-3 text-sm text-gray-900">
            <div>
              <span className="font-medium text-gray-500">Subject</span>
              <p className="mt-0.5">{query.subject || query.name || "—"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Email</span>
              <p className="mt-0.5">{query.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Message</span>
              <p className="mt-0.5 whitespace-pre-wrap">{query.description || query.message || "—"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Status</span>
              <div className="mt-1 flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={!!(id && updatingId === id)}
                  className="border rounded px-2 py-1.5 text-sm w-full max-w-[140px] bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <StatusBadge status={selectedStatus} type="query" />
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="admin-modal-footer rounded-b-lg px-6 py-4 gap-2 shrink-0">
          <Button className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={Boolean(!(id && selectedStatus) || (id && updatingId === id))}
            className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0"
          >
            Update status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

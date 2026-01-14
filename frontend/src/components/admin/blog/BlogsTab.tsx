import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterTabs from "@/components/ui/FilterTabs";
import BlogModal from "./BlogModal";
import DeleteModal from "@/components/admin/product/DeleteModal";
import { getBlogs, deleteBlog, getBlogCategories, getBlogAuthors, type Blog, type BlogCategory, type BlogAuthor } from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";
import { Grid3x3, List } from "lucide-react";
import BlogGrid from "./BlogGrid";

type ViewMode = "list" | "grid";
type StatusFilter = "All" | "published" | "unpublished" | "draft";

export default function BlogsTab() {
  const { success, error } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<Blog | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, search, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsData, categoriesData, authorsData] = await Promise.all([
        getBlogs(),
        getBlogCategories(),
        getBlogAuthors(),
      ]);
      setBlogs(blogsData);
      setCategories(categoriesData);
      setAuthors(authorsData);
    } catch (err: any) {
      error(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (search) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          (blog.subTitle && blog.subTitle.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    setFiltered(filtered);
  };

  const openAdd = () => {
    setSelected(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setSelected(blog);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (blog: Blog) => {
    setSelected(blog);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await deleteBlog(deleteId);
      success("Blog deleted successfully");
      setDeleteOpen(false);
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      error(err.message || "Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getColumns = () => {
    return [
      {
        name: "ID",
        selector: (row: Blog) => row._id.slice(-6),
        sortable: true,
        minWidth: "80px",
      },
      {
        name: "Tag",
        cell: (row: Blog) => (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {row.tags.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-gray-500">+{row.tags.length - 2}</span>
            )}
          </div>
        ),
        minWidth: "120px",
      },
      {
        name: "Title",
        heading: (row: Blog) => row.title,
        subInfo: (row: Blog) => row.subTitle || "",
        sortable: true,
        minWidth: "200px",
      },
      {
        name: "Category",
        selector: (row: Blog) =>
          typeof row.category === "object" ? row.category.name : "Unknown",
        sortable: true,
        minWidth: "120px",
      },
      {
        name: "Author",
        selector: (row: Blog) =>
          typeof row.author === "object" ? row.author.name : "Unknown",
        sortable: true,
        minWidth: "120px",
      },
      {
        name: "Views",
        selector: (row: Blog) => row.views || 0,
        sortable: true,
        minWidth: "80px",
      },
      {
        name: "Comments",
        selector: (row: Blog) => row.comments || 0,
        sortable: true,
        minWidth: "100px",
      },
      {
        name: "Status",
        cell: (row: Blog) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.status === "published"
                ? "bg-green-100 text-green-800"
                : row.status === "unpublished"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status}
          </span>
        ),
        sortable: true,
        minWidth: "100px",
      },
    ];
  };

  return (
    <div className="w-full">
      {/* Header with Search, Filter, View Toggle, and Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
          <FilterTabs
            tabs={[
              { id: "All", label: "All" },
              { id: "published", label: "Published" },
              { id: "unpublished", label: "Unpublished" },
              { id: "draft", label: "Draft" },
            ]}
            activeTab={statusFilter}
            onTabChange={(tabId) => setStatusFilter(tabId as StatusFilter)}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "theme-button text-white" : ""}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "theme-button text-white" : ""}
            >
              <Grid3x3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 text-gray-900"
            style={{ borderColor: "var(--theme-primary)" }}
          />
          <Button
            className="text-white w-full sm:w-auto theme-button"
            onClick={openAdd}
          >
            + Add New
          </Button>
        </div>
      </div>

      {/* Content - List or Grid View */}
      {loading ? (
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <DataTableSkeleton rows={8} />
          </div>
        </div>
      ) : viewMode === "list" ? (
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <EnhancedDataTable<Blog>
            columns={getColumns()}
            data={filtered}
            onView={openView}
            onEdit={openEdit}
            onDelete={(row) => {
              setDeleteId(row._id);
              setDeleteOpen(true);
            }}
            pagination
          />
        </div>
      ) : (
        <BlogGrid
          blogs={filtered}
          onView={openView}
          onEdit={openEdit}
          onDelete={(blog) => {
            setDeleteId(blog._id);
            setDeleteOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <BlogModal
        open={modalOpen}
        mode={modalMode}
        categories={categories}
        authors={authors}
        data={selected || undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={async (formData) => {
          if (modalMode === "add") {
            await getBlogs(); // Refresh
          } else if (modalMode === "edit" && selected?._id) {
            await getBlogs(); // Refresh
          }
          setModalOpen(false);
          loadData();
        }}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </div>
  );
}

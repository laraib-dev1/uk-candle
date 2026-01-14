import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogCategoryModal from "./BlogCategoryModal";
import DeleteModal from "@/components/admin/product/DeleteModal";
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  type BlogCategory,
} from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";

export default function BlogCategoriesTab() {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filtered, setFiltered] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<BlogCategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, search]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getBlogCategories();
      setCategories(data);
    } catch (err: any) {
      error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;
    if (search) {
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(filtered);
  };

  const openAdd = () => {
    setSelected(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEdit = (category: BlogCategory) => {
    setSelected(category);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (category: BlogCategory) => {
    setSelected(category);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await deleteBlogCategory(deleteId);
      success("Category deleted successfully");
      setDeleteOpen(false);
      setDeleteId(null);
      loadCategories();
    } catch (err: any) {
      error(err.response?.data?.message || err.message || "Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getColumns = () => {
    return [
      {
        name: "ID",
        selector: (row: BlogCategory) => row._id.slice(-6),
        sortable: true,
        minWidth: "80px",
      },
      {
        name: "Category",
        selector: (row: BlogCategory) => row.name,
        sortable: true,
        minWidth: "200px",
      },
      {
        name: "Blogs",
        selector: (row: BlogCategory) => row.blogs || 0,
        sortable: true,
        minWidth: "100px",
      },
    ];
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 text-gray-900"
            style={{ borderColor: "var(--theme-primary)" }}
          />
        </div>
        <Button
          className="text-white w-full sm:w-auto theme-button"
          onClick={openAdd}
        >
          + Add New
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <DataTableSkeleton rows={8} />
          </div>
        ) : (
          <EnhancedDataTable<BlogCategory>
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
        )}
      </div>

      <BlogCategoryModal
        open={modalOpen}
        mode={modalMode}
        data={selected || undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            if (modalMode === "add") {
              await createBlogCategory(formData.name);
              success("Category created successfully");
            } else if (modalMode === "edit" && selected?._id) {
              await updateBlogCategory(selected._id, formData.name);
              success("Category updated successfully");
            }
            setModalOpen(false);
            loadCategories();
          } catch (err: any) {
            error(err.response?.data?.message || err.message || "Failed to save category");
          }
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
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogAuthorModal from "./BlogAuthorModal";
import DeleteModal from "@/components/admin/product/DeleteModal";
import {
  getBlogAuthors,
  createBlogAuthor,
  updateBlogAuthor,
  deleteBlogAuthor,
  type BlogAuthor,
} from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";

interface BlogAuthorsTabProps {
  onAuthorSelect?: (authorId: string) => void;
}

export default function BlogAuthorsTab({ onAuthorSelect }: BlogAuthorsTabProps) {
  const { success, error } = useToast();
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [filtered, setFiltered] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<BlogAuthor | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    filterAuthors();
  }, [authors, search]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const data = await getBlogAuthors();
      setAuthors(data);
    } catch (err: any) {
      error(err.message || "Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const filterAuthors = () => {
    let filtered = authors;
    if (search) {
      filtered = filtered.filter(
        (author) =>
          author.name.toLowerCase().includes(search.toLowerCase()) ||
          author.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(filtered);
  };

  const openAdd = () => {
    setSelected(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEdit = (author: BlogAuthor) => {
    setSelected(author);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (author: BlogAuthor) => {
    setSelected(author);
    setModalMode("view");
    setModalOpen(true);
    if (onAuthorSelect) {
      onAuthorSelect(author._id);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await deleteBlogAuthor(deleteId);
      success("Author deleted successfully");
      setDeleteOpen(false);
      setDeleteId(null);
      loadAuthors();
    } catch (err: any) {
      error(err.response?.data?.message || err.message || "Failed to delete author");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getColumns = () => {
    return [
      {
        name: "ID",
        selector: (row: BlogAuthor) => row._id.slice(-6),
        sortable: true,
        minWidth: "80px",
      },
      {
        name: "Name",
        heading: (row: BlogAuthor) => row.name,
        subInfo: (row: BlogAuthor) => row.email,
        sortable: true,
        minWidth: "200px",
      },
      {
        name: "Email",
        selector: (row: BlogAuthor) => row.email,
        sortable: true,
        minWidth: "200px",
      },
      {
        name: "Blogs",
        selector: (row: BlogAuthor) => row.blogs || 0,
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
          <EnhancedDataTable<BlogAuthor>
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

      <BlogAuthorModal
        open={modalOpen}
        mode={modalMode}
        data={selected || undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            if (modalMode === "add") {
              await createBlogAuthor(formData);
              success("Author created successfully");
            } else if (modalMode === "edit" && selected?._id) {
              await updateBlogAuthor(selected._id, formData);
              success("Author updated successfully");
            }
            setModalOpen(false);
            loadAuthors();
          } catch (err: any) {
            error(err.response?.data?.message || err.message || "Failed to save author");
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
        title="Delete Author"
        message="Are you sure you want to delete this author? This action cannot be undone."
      />
    </div>
  );
}

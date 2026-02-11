import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBlogCategory, updateBlogCategory } from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";

interface Category {
  id?: string;
  _id?: string;
  name: string;
  blogs: number;
}

interface BlogCategoryModalProps {
  open: boolean;
  mode: "add" | "edit" | "view";
  data?: Category;
  onClose: () => void;
  onSubmit: () => void;
}

export default function BlogCategoryModal({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: BlogCategoryModalProps) {
  const { success, error } = useToast();
  const isView = mode === "view";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: data?.name || "",
  });

  useEffect(() => {
    setForm({
      name: data?.name || "",
    });
  }, [data, open]);

  const handleSubmit = async () => {
    if (isView) {
      onClose();
      return;
    }

    if (!form.name.trim()) {
      error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      if (mode === "add") {
        await createBlogCategory({ name: form.name });
        success("Category created successfully!");
      } else if (mode === "edit" && data?.id) {
        await updateBlogCategory(data.id, { name: form.name });
        success("Category updated successfully!");
      }
      onSubmit();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="admin-dialog-content max-w-md bg-white p-0 gap-0 overflow-hidden">
        <DialogHeader className="admin-modal-header flex items-center justify-between text-left px-6 py-4 rounded-t-lg">
          <div>
            <DialogTitle className="text-xl font-bold text-white">
              {mode === "add" ? "Add Category" : mode === "edit" ? "Edit Category" : "View Category"}
            </DialogTitle>
            <DialogDescription className="text-white/90">
              {mode === "add" ? "Create a new blog category" : mode === "edit" ? "Update category details" : "View category details"}
            </DialogDescription>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded text-white hover:bg-white/20 transition-colors shrink-0" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 text-gray-900">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">Category Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter category name"
              disabled={isView}
              className="w-full text-gray-900"
            />
          </div>
        </div>

        <DialogFooter className="admin-modal-footer rounded-b-lg px-6 py-4 gap-2">
          <Button className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0" onClick={onClose}>
            {isView ? "Close" : "Cancel"}
          </Button>
          {!isView && (
            <Button className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCategory } from "@/api/blog.api";

interface BlogCategoryModalProps {
  open: boolean;
  mode: "add" | "edit" | "view";
  data?: BlogCategory;
  onClose: () => void;
  onSubmit: (formData: { name: string }) => void;
}

export default function BlogCategoryModal({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: BlogCategoryModalProps) {
  const isView = mode === "view";
  const [name, setName] = useState(data?.name || "");

  useEffect(() => {
    setName(data?.name || "");
  }, [data, open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }
    onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="theme-heading" style={{ color: "var(--theme-primary)" }}>
            {mode === "add" ? "Add Category" : mode === "edit" ? "Edit Category" : "View Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new blog category."
              : mode === "edit"
              ? "Update the category information."
              : "View category details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isView}
              className="text-gray-900"
              placeholder="Enter category name"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            {isView ? "Close" : "Cancel"}
          </Button>
          {!isView && (
            <Button className="theme-button text-white" onClick={handleSubmit}>
              {mode === "add" ? "Create" : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

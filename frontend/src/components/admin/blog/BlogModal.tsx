import React, { useEffect, useState } from "react";
import { RichTextEditor } from "@mantine/rte";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import { Blog, BlogCategory, BlogAuthor } from "@/api/blog.api";
import { createBlog, updateBlog } from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";

interface BlogModalProps {
  open: boolean;
  mode: "add" | "edit" | "view";
  categories: BlogCategory[];
  authors: BlogAuthor[];
  data?: Blog;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function BlogModal({
  open,
  mode,
  categories,
  authors,
  data,
  onClose,
  onSubmit,
}: BlogModalProps) {
  const { success, error } = useToast();
  const isView = mode === "view";
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const [form, setForm] = useState({
    title: data?.title || "",
    subTitle: data?.subTitle || "",
    description: data?.description || "",
    category: typeof data?.category === "object" ? data.category._id : data?.category || (categories[0]?._id || ""),
    author: typeof data?.author === "object" ? data.author._id : data?.author || (authors[0]?._id || ""),
    tags: data?.tags || [],
    image: data?.image || "",
    status: data?.status || "draft",
    imageFile: null as File | null,
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        subTitle: data.subTitle || "",
        description: data.description || "",
        category: typeof data.category === "object" ? data.category._id : data.category || "",
        author: typeof data.author === "object" ? data.author._id : data.author || "",
        tags: data.tags || [],
        image: data.image || "",
        status: data.status || "draft",
        imageFile: null,
      });
      setTagsInput(data.tags?.join(", ") || "");
    } else {
      setForm({
        title: "",
        subTitle: "",
        description: "",
        category: categories[0]?._id || "",
        author: authors[0]?._id || "",
        tags: [],
        image: "",
        status: "draft",
        imageFile: null,
      });
      setTagsInput("");
    }
  }, [data, open, categories, authors]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileForCrop(file);
    setCropModalOpen(true);
  };

  const handleCropDone = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "blog.jpg", { type: "image/jpeg" });
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
    setCropModalOpen(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.title || !form.description || !form.category || !form.author) {
      error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Parse tags from comma-separated string
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subTitle", form.subTitle);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("author", form.author);
      formData.append("tags", JSON.stringify(tags));
      formData.append("status", form.status);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      } else if (form.image) {
        formData.append("image", form.image);
      }

      if (mode === "add") {
        await createBlog(formData as any);
        success("Blog created successfully");
      } else if (mode === "edit" && data?._id) {
        await updateBlog(data._id, formData as any);
        success("Blog updated successfully");
      }

      onSubmit(formData);
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="theme-heading" style={{ color: "var(--theme-primary)" }}>
              {mode === "add" ? "Add Blog" : mode === "edit" ? "Edit Blog" : "View Blog"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add" 
                ? "Create a new blog post with title, description, category, and author."
                : mode === "edit"
                ? "Update the blog post information."
                : "View blog post details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                disabled={isView}
                className="text-gray-900"
              />
            </div>

            {/* Sub Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Title
              </label>
              <Input
                value={form.subTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, subTitle: e.target.value }))}
                disabled={isView}
                className="text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                disabled={isView}
              >
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.author}
                onValueChange={(value) => setForm((prev) => ({ ...prev, author: value }))}
                disabled={isView}
              >
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Select Author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author._id} value={author._id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={form.description}
                onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                readOnly={isView}
                style={{ minHeight: "300px" }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="tag1, tag2, tag3"
                disabled={isView}
                className="text-gray-900"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center gap-4">
                {form.image && (
                  <img
                    src={form.image}
                    alt="Blog"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                )}
                {!isView && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="text-sm text-gray-700"
                  />
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(value: "published" | "unpublished" | "draft") =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
                disabled={isView}
              >
                <SelectTrigger className="text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              {isView ? "Close" : "Discard"}
            </Button>
            {!isView && (
              <Button
                className="theme-button text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageCropperModal
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        file={selectedFileForCrop}
        onCropDone={handleCropDone}
        aspectRatio={16 / 9}
      />
    </>
  );
}

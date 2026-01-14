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
import { Textarea } from "@/components/ui/textarea";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import { BlogAuthor } from "@/api/blog.api";

interface BlogAuthorModalProps {
  open: boolean;
  mode: "add" | "edit" | "view";
  data?: BlogAuthor;
  onClose: () => void;
  onSubmit: (formData: Partial<BlogAuthor>) => void;
}

export default function BlogAuthorModal({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: BlogAuthorModalProps) {
  const isView = mode === "view";
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: data?.name || "",
    email: data?.email || "",
    bio: data?.bio || "",
    avatar: data?.avatar || "",
    socialLinks: {
      facebook: data?.socialLinks?.facebook || "",
      twitter: data?.socialLinks?.twitter || "",
      youtube: data?.socialLinks?.youtube || "",
      instagram: data?.socialLinks?.instagram || "",
      linkedin: data?.socialLinks?.linkedin || "",
    },
    avatarFile: null as File | null,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        socialLinks: {
          facebook: data.socialLinks?.facebook || "",
          twitter: data.socialLinks?.twitter || "",
          youtube: data.socialLinks?.youtube || "",
          instagram: data.socialLinks?.instagram || "",
          linkedin: data.socialLinks?.linkedin || "",
        },
        avatarFile: null,
      });
    } else {
      setForm({
        name: "",
        email: "",
        bio: "",
        avatar: "",
        socialLinks: {
          facebook: "",
          twitter: "",
          youtube: "",
          instagram: "",
          linkedin: "",
        },
        avatarFile: null,
      });
    }
  }, [data, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileForCrop(file);
    setCropModalOpen(true);
  };

  const handleCropDone = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "author.jpg", { type: "image/jpeg" });
    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatar: URL.createObjectURL(file),
    }));
    setCropModalOpen(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("bio", form.bio);
    formData.append("socialLinks", JSON.stringify(form.socialLinks));

    if (form.avatarFile) {
      formData.append("avatar", form.avatarFile);
    } else if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    onSubmit(formData as any);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="theme-heading" style={{ color: "var(--theme-primary)" }}>
              {mode === "add" ? "Add Author" : mode === "edit" ? "Edit Author" : "View Author"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add" 
                ? "Create a new blog author with name, email, bio, and social links."
                : mode === "edit"
                ? "Update the author information."
                : "View author details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={isView}
                className="text-gray-900"
                placeholder="Enter author name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                disabled={isView}
                className="text-gray-900"
                placeholder="Enter email"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                disabled={isView}
                className="text-gray-900"
                placeholder="Enter bio"
                rows={4}
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar
              </label>
              <div className="flex items-center gap-4">
                {form.avatar && (
                  <img
                    src={form.avatar}
                    alt="Author"
                    className="w-24 h-24 object-cover rounded-full border border-gray-300"
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

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              <div className="space-y-2">
                <Input
                  value={form.socialLinks.facebook}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                    }))
                  }
                  disabled={isView}
                  className="text-gray-900"
                  placeholder="Facebook URL"
                />
                <Input
                  value={form.socialLinks.twitter}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                    }))
                  }
                  disabled={isView}
                  className="text-gray-900"
                  placeholder="Twitter URL"
                />
                <Input
                  value={form.socialLinks.youtube}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, youtube: e.target.value },
                    }))
                  }
                  disabled={isView}
                  className="text-gray-900"
                  placeholder="YouTube URL"
                />
                <Input
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                    }))
                  }
                  disabled={isView}
                  className="text-gray-900"
                  placeholder="Instagram URL"
                />
                <Input
                  value={form.socialLinks.linkedin}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                    }))
                  }
                  disabled={isView}
                  className="text-gray-900"
                  placeholder="LinkedIn URL"
                />
              </div>
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

      <ImageCropperModal
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        file={selectedFileForCrop}
        onCropDone={handleCropDone}
        aspectRatio={1}
      />
    </>
  );
}

import React, { useEffect, useState } from "react";
import { getBlogAuthorById, updateBlogAuthor, type BlogAuthor } from "@/api/blog.api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import PageLoader from "@/components/ui/PageLoader";

interface BlogAuthorProfileTabProps {
  authorId: string | null;
}

export default function BlogAuthorProfileTab({ authorId }: BlogAuthorProfileTabProps) {
  const { success, error } = useToast();
  const [author, setAuthor] = useState<BlogAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
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
    avatarFile: null as File | null,
  });

  useEffect(() => {
    if (authorId) {
      loadAuthor();
    } else {
      setAuthor(null);
      setLoading(false);
    }
  }, [authorId]);

  const loadAuthor = async () => {
    if (!authorId) return;
    try {
      setLoading(true);
      const data = await getBlogAuthorById(authorId);
      setAuthor(data);
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
    } catch (err: any) {
      error(err.message || "Failed to load author");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!authorId) return;
    try {
      setSaving(true);
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

      await updateBlogAuthor(authorId, formData as any);
      success("Author profile updated successfully");
      setIsEditing(false);
      loadAuthor();
    } catch (err: any) {
      error(err.response?.data?.message || err.message || "Failed to update author");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading author profile..." />;
  }

  if (!authorId || !author) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select an author from the Authors tab to view their profile.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold theme-heading" style={{ color: "var(--theme-primary)" }}>
            Author Profile
          </h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                  Discard
                </Button>
                <Button
                  className="theme-button text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update"}
                </Button>
              </>
            ) : (
              <Button className="theme-button text-white" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-4">
              {form.avatar && (
                <img
                  src={form.avatar}
                  alt={form.name}
                  className="w-24 h-24 object-cover rounded-full border border-gray-300"
                />
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="text-sm text-gray-700"
                />
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name or Business
            </label>
            {isEditing ? (
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="text-gray-900"
                placeholder="Enter name"
              />
            ) : (
              <p className="text-gray-900">{form.name || "Not set"}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="text-gray-900"
                placeholder="Enter email"
              />
            ) : (
              <p className="text-gray-900">{form.email || "Not set"}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <Textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                className="text-gray-900"
                placeholder="Enter bio"
                rows={4}
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{form.bio || "Not set"}</p>
            )}
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Links
            </label>
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <Input
                    value={form.socialLinks.facebook}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                      }))
                    }
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
                    className="text-gray-900"
                    placeholder="LinkedIn URL"
                  />
                </>
              ) : (
                <div className="space-y-1">
                  {form.socialLinks.facebook && (
                    <p className="text-gray-900">Facebook: {form.socialLinks.facebook}</p>
                  )}
                  {form.socialLinks.twitter && (
                    <p className="text-gray-900">Twitter: {form.socialLinks.twitter}</p>
                  )}
                  {form.socialLinks.youtube && (
                    <p className="text-gray-900">YouTube: {form.socialLinks.youtube}</p>
                  )}
                  {form.socialLinks.instagram && (
                    <p className="text-gray-900">Instagram: {form.socialLinks.instagram}</p>
                  )}
                  {form.socialLinks.linkedin && (
                    <p className="text-gray-900">LinkedIn: {form.socialLinks.linkedin}</p>
                  )}
                  {!Object.values(form.socialLinks).some((v) => v) && (
                    <p className="text-gray-500">No social links set</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

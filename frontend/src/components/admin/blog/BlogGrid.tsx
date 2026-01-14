import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Blog } from "@/api/blog.api";
import { Button } from "@/components/ui/button";

interface BlogGridProps {
  blogs: Blog[];
  onView: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

export default function BlogGrid({ blogs, onView, onEdit, onDelete }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {blogs.map((blog) => {
        const categoryName =
          typeof blog.category === "object" ? blog.category.name : "Unknown";
        const authorName =
          typeof blog.author === "object" ? blog.author.name : "Unknown";
        const authorAvatar =
          typeof blog.author === "object" && blog.author.avatar
            ? blog.author.avatar
            : "/product.png";

        return (
          <div
            key={blog._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
              <img
                src={blog.image || "/product.png"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-800"
                      : blog.status === "unpublished"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2" title={blog.title}>
                {blog.title}
              </h3>
              {blog.subTitle && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1" title={blog.subTitle}>
                  {blog.subTitle}
                </p>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{blog.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{categoryName}</span>
                <div className="flex items-center gap-3">
                  <span>{blog.views || 0} views</span>
                  <span>{blog.comments || 0} comments</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700">{authorName}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(blog)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(blog)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(blog)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

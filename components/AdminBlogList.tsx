"use client";

import { useState } from "react";
import BlogCard, {
  type BlogCardData,
} from "@/components/BlogCard";

type AdminBlogListProps = {
  initialBlogs: BlogCardData[];
};

type BlogFormData = {
  title: string;
  slug: string;
  content: string;
};

export default function AdminBlogList({
  initialBlogs,
}: AdminBlogListProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  function startEditing(blog: BlogCardData) {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
    });
  }

  async function handleUpdate(id: string) {
    if (!formData.title.trim()) {
      alert("𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐚𝐫𝐭𝐢𝐜𝐥𝐞 𝐭𝐢𝐭𝐥𝐞");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐞𝐝𝐢𝐭 𝐭𝐡𝐞 𝐚𝐫𝐭𝐢𝐜𝐥𝐞");
      }

      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) =>
          blog._id === id ? result.blog : blog,
        ),
      );

      cancelEditing();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐞𝐝𝐢𝐭 𝐭𝐡𝐞 𝐚𝐫𝐭𝐢𝐜𝐥𝐞",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "𝐀𝐫𝐞 𝐲𝐨𝐮 𝐬𝐮𝐫𝐞 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐝𝐞𝐥𝐞𝐭𝐞 𝐭𝐡𝐢𝐬 𝐚𝐫𝐭𝐢𝐜𝐥𝐞?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ลบบทความไม่สำเร็จ");
      }

      setBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => blog._id !== id),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐞𝐥𝐞𝐭𝐞 𝐭𝐡𝐞 𝐚𝐫𝐭𝐢𝐜𝐥𝐞",
      );
    }
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
        𝐍𝐨 𝐚𝐫𝐭𝐢𝐜𝐥𝐞𝐬 𝐲𝐞𝐭
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {blogs.map((blog) => {
        const isEditing = editingId === blog._id;

        return (
          <div
            key={blog._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      title: event.target.value,
                    })
                  }
                  placeholder="𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐭𝐢𝐭𝐥𝐞"
                  className="w-full rounded-lg border px-4 py-2"
                />

                <input
                  value={formData.slug}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      slug: event.target.value,
                    })
                  }
                  placeholder="𝐒𝐥𝐮𝐠"
                  className="w-full rounded-lg border px-4 py-2"
                />

                <textarea
                  value={formData.content}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      content: event.target.value,
                    })
                  }
                  placeholder="𝐇𝐓𝐌𝐋 𝐜𝐨𝐧𝐭𝐞𝐧𝐭"
                  rows={10}
                  className="w-full rounded-lg border px-4 py-2"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdate(blog._id)}
                    disabled={isSaving}
                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isSaving ? "𝐒𝐚𝐯𝐢𝐧𝐠..." : "𝐒𝐚𝐯𝐞"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
                  >
                    𝐂𝐚𝐧𝐜𝐞𝐥
                  </button>
                </div>
              </div>
            ) : (
              <>
                <BlogCard blog={blog} />

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEditing(blog)}
                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                  >
                    𝐄𝐝𝐢𝐭
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(blog._id)}
                    className="rounded-lg border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
                  >
                    𝐃𝐞𝐥𝐞𝐭𝐞
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
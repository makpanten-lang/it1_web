import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const metadata: Metadata = {
  title: "𝐀𝐫𝐭𝐢𝐜𝐥𝐞",
  description: "𝐋𝐚𝐭𝐞𝐬𝐭 𝐀𝐫𝐭𝐢𝐜𝐥𝐞𝐬 & 𝐍𝐞𝐰𝐬",
};

export const dynamic = "force-dynamic";

export default async function BlogsCard() {

  await connectDB();

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .lean();

  const serializedBlogs = blogs.map((blog) => ({
    _id: blog._id.toString(),
    title: String(blog.title ?? ""),
    slug: String(blog.slug ?? ""),
    content: String(blog.content ?? ""),
    createdAt: blog.createdAt
      ? new Date(blog.createdAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : "",
  }));

  return (

    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-green-700">
          𝐁𝐥𝐨𝐠
        </p>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          𝐀𝐥𝐥 𝐀𝐫𝐭𝐢𝐜𝐥𝐞𝐬
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          𝐒𝐭𝐚𝐲 𝐮𝐩𝐝𝐚𝐭𝐞𝐝 𝐰𝐢𝐭𝐡 𝐨𝐮𝐫 𝐥𝐚𝐭𝐞𝐬𝐭 𝐚𝐫𝐭𝐢𝐜𝐥𝐞𝐬, 𝐧𝐞𝐰𝐬, 𝐚𝐧𝐝 𝐬𝐭𝐨𝐫𝐢𝐞𝐬
        </p>
      </header>

      {serializedBlogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center text-gray-500">
          𝐍𝐨 𝐚𝐫𝐭𝐢𝐜𝐥𝐞𝐬 𝐲𝐞𝐭
        </div>
      ) : (
        <section
          aria-label="𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐋𝐢𝐬𝐭"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {serializedBlogs.map((blog) => (
            <article
              key={blog._id}
              className="flex min-h-64 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {blog.createdAt && (
                <time className="text-sm text-gray-500">
                  {blog.createdAt}
                </time>
              )}

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {blog.title}
              </h2>

              {blog.slug && (
                <p className="mt-1 text-sm text-green-700">#{blog.slug}</p>
              )}

              <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                {blog.content || "𝐓𝐡𝐢𝐬 𝐚𝐫𝐭𝐢𝐜𝐥𝐞 𝐡𝐚𝐬 𝐧𝐨 𝐝𝐞𝐭𝐚𝐢𝐥𝐬 𝐲𝐞𝐭"}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>

  )

}

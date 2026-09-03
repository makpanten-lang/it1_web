import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  const latestProducts = await Product.find({ published: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  const serializedProducts = latestProducts.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    category:
      product.category &&
      typeof product.category === "object" &&
      "name" in product.category
        ? {
            _id:
              "_id" in product.category && product.category._id
                ? product.category._id.toString()
                : "",
            name: String(product.category.name),
          }
        : undefined,
  }));

  return (
    <main className="bg-[#0A0A0A] text-[#EDEDED]">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-28 text-center">
        <div className="w-full max-w-2xl">
          <Image
            src="/logo_white.png"
            alt="NOXVAULT"
            width={900}
            height={300}
            priority
            className="mx-auto h-auto w-full"
          />
        </div>

        <p className="mt-8 max-w-md text-sm leading-relaxed text-[#8C8C8C]">
          Dark, heavyweight streetwear built in small, numbered drops.
          Once a piece sells out, it doesn&apos;t come back.
        </p>

        <Link
          href="/products"
          className="mt-10 border border-[#EDEDED] px-8 py-3 text-sm tracking-wide transition-colors hover:bg-[#EDEDED] hover:text-[#0A0A0A]"
        >
          Shop the collection
        </Link>
      </section>

      <div className="mx-auto h-px w-full max-w-6xl bg-[#262626]" />

      {/* Latest products */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Latest drop</h2>
          <Link
            href="/products"
            className="text-sm text-[#8C8C8C] hover:text-[#EDEDED]"
          >
            View all
          </Link>
        </div>

        {serializedProducts.length === 0 ? (
          <div className="border border-[#262626] p-10 text-center text-[#8C8C8C]">
            No products yet. Add your first piece from the admin dashboard.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serializedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

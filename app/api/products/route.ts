import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";

    const filter: Record<string, unknown> = {};

    if (!includeUnpublished) {
      filter.published = true;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      { message: "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐭𝐡𝐞 𝐩𝐫𝐨𝐝𝐮𝐜𝐭" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      slug,
      description,
      price,
      stock,
      category,
      imageUrl,
      imagePublicId,
      published,
    } = body;

    if (
      !name ||
      !slug ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !imageUrl ||
      !imagePublicId
    ) {
      return NextResponse.json(
        { message: "𝐏𝐥𝐞𝐚𝐬𝐞 𝐟𝐢𝐥𝐥 𝐢𝐧 𝐚𝐥𝐥 𝐩𝐫𝐨𝐝𝐮𝐜𝐭 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧" },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findOne({
      slug: String(slug).trim().toLowerCase(),
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "𝐓𝐡𝐢𝐬 𝐩𝐫𝐨𝐝𝐮𝐜𝐭 𝐬𝐥𝐮𝐠 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬" },
        { status: 409 }
      );
    }

    const categoryExists = await Category.exists({
      _id: category,
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: "𝐒𝐞𝐥𝐞𝐜𝐭𝐞𝐝 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: String(name).trim(),
      slug: String(slug).trim().toLowerCase(),
      description: String(description).trim(),
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
      imagePublicId,
      published: published ?? true,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .lean();

    return NextResponse.json(
      {
        message: "𝐏𝐫𝐨𝐝𝐮𝐜𝐭 𝐚𝐝𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲",
        product: populatedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST product error:", error);

    return NextResponse.json(
      { message: "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐚𝐝𝐝 𝐭𝐡𝐞 𝐩𝐫𝐨𝐝𝐮𝐜𝐭" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();

    const blog = await Blog.find()
      .sort({ title: 1 })
      .lean();

    return NextResponse.json({
      blog,
    });
  } catch (error) {
    console.error("GET blog error:", error); // แก้ข้อความ log ให้ตรงกัน

    return NextResponse.json(
      { message: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐝𝐚𝐭𝐚" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // เปลี่ยนชื่อตัวแปรให้ตรงกับการใช้งานด้านล่าง หรือใช้ title / content ไปเลย
    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase();
    const content = String(body.content ?? "").trim(); // เปลี่ยนจาก description เป็น content

    if (!title || !slug) {
      return NextResponse.json(
        { message: "𝐏𝐥𝐞𝐚𝐬𝐞 𝐟𝐢𝐥𝐥 𝐢𝐧 𝐭𝐡𝐞 𝐭𝐢𝐭𝐥𝐞 𝐚𝐧𝐝 𝐬𝐥𝐮𝐠" },
        { status: 400 }
      );
    }

    const existingBlog = await Blog.findOne({
      $or: [{ title }, { slug }],
    });

    if (existingBlog                        ) {
      return NextResponse.json(
        { message: "𝐓𝐢𝐭𝐥𝐞 𝐨𝐫 𝐬𝐥𝐮𝐠 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬" },
        { status: 409 }
      );
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
    });

    return NextResponse.json(
      {
        message: "𝐃𝐚𝐭𝐚 𝐚𝐝𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      { message: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐚𝐝𝐝 𝐝𝐚𝐭𝐚" },
      { status: 500 }
    );
  }
}
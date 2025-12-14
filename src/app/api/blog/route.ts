import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/blog-service";

export async function GET() {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
}

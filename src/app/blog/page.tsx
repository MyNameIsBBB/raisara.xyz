import { BlogPost, getBlogs } from "@/lib/blog-service";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";

const statusMap: Record<string, { label: string; color: string }> = {
    "in-progress": {
        label: "กำลังทำ",
        color: "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30",
    },
    queued: {
        label: "รอคิวอยู่",
        color: "bg-slate-500/20 text-slate-500 hover:bg-slate-500/30",
    },
    done: {
        label: "เสร็จแล้ว",
        color: "bg-green-500/20 text-green-500 hover:bg-green-500/30",
    },
    beta: {
        label: "เปิด Beta",
        color: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
    },
};

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="flex flex-col items-center mb-12 space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Development Updates
                </h1>
                <p className="text-muted-foreground max-w-lg">
                    ติดตามความคืบหน้าการพัฒนาและฟีเจอร์ใหม่ๆ ได้ที่นี่
                </p>
            </div>

            <div className="grid gap-6">
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        className="overflow-hidden bg-card border-border"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-semibold">
                                    {blog.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {format(
                                        new Date(blog.createdAt),
                                        "dd MMM yyyy"
                                    )}
                                </p>
                            </div>
                            <Badge
                                className={statusMap[blog.status]?.color || ""}
                            >
                                {statusMap[blog.status]?.label || blog.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                                {blog.description}
                            </p>
                            {blog.imageUrl && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        className="w-full h-auto object-cover max-h-96"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

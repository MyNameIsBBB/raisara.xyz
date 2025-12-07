import Link from "next/link";
import { QrCode } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ToolsPage() {
    const tools = [
        {
            title: "แปลง Link เป็น QR Code",
            description: "สร้าง QR Code จากลิงก์เว็บไซต์ของคุณได้ง่ายๆ",
            icon: QrCode,
            href: "/tools/qrcode",
        },
    ];

    return (
        <div className="container py-20 max-w-5xl mx-auto px-4 min-h-[calc(100vh-3.5rem)] flex flex-col">
            <div className="mb-12 space-y-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    เครื่องมือ
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    เลือกเครื่องมือที่คุณต้องการใช้งาน เรามีเครื่องมือไร้สาระ
                    (แต่มีประโยชน์) ให้เลือกมากมาย
                </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="group">
                        <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
                            <CardHeader>
                                <div className="p-3 w-fit rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border-2 border-border mb-4 group-hover:bg-[#22c55e] transition-colors">
                                    <tool.icon className="h-6 w-6 text-foreground group-hover:text-black" />
                                </div>
                                <CardTitle className="text-xl">
                                    {tool.title}
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

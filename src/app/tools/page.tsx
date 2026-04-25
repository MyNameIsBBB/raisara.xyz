"use client";

import Link from "next/link";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { toolDefinitions } from "@/lib/tools";

export default function ToolsPage() {
    const { isAuthenticated } = useAuth();

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
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                    เครื่องมือแต่ละชิ้นคุมสิทธิ์ผ่านตัวแปร canUseWithoutLogin
                    เพื่อให้คุณต่อ backend ฝั่ง Express ได้ต่อทีหลังง่ายขึ้น
                </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {toolDefinitions.map((tool) => {
                    const isUnlocked =
                        tool.canUseWithoutLogin || isAuthenticated;
                    const destination = isUnlocked
                        ? tool.href
                        : `/login?redirect=${encodeURIComponent(tool.href)}`;

                    return (
                        <Link
                            key={tool.href}
                            href={destination}
                            className="group"
                        >
                            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="p-3 w-fit rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border-2 border-border group-hover:bg-[#22c55e] transition-colors">
                                            <tool.icon className="h-6 w-6 text-foreground group-hover:text-black" />
                                        </div>
                                        <Badge
                                            variant={
                                                tool.canUseWithoutLogin
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                        >
                                            {tool.badgeLabel}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">
                                        {tool.title}
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2 min-h-12">
                                        {tool.description}
                                    </CardDescription>
                                    <div className="pt-4">
                                        <Button
                                            variant={
                                                isUnlocked
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {isUnlocked
                                                ? "เข้าใช้งาน"
                                                : "Login เพื่อใช้งาน"}
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

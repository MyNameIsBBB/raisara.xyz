"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function ToolAccessGate({
    canUseWithoutLogin,
    children,
}: {
    canUseWithoutLogin: boolean;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { isAuthenticated, loginWithGoogle } = useAuth();

    if (canUseWithoutLogin || isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="container max-w-3xl mx-auto px-4 py-20 min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
            <Card className="w-full border-2 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary/10">
                        <Lock className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        หน้านี้ต้องล็อกอินก่อน
                    </CardTitle>
                    <CardDescription className="text-base max-w-xl mx-auto">
                        เครื่องมือนี้เปิดให้เฉพาะสมาชิกที่ล็อกอินแล้วใช้งาน
                        เพื่อให้คุณต่อ backend จริงภายหลังได้ง่ายขึ้น
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button asChild size="lg">
                            <Link
                                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                            >
                                ไปหน้า Login
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link
                                href={`/register?redirect=${encodeURIComponent(pathname)}`}
                            >
                                ไปหน้า Register
                            </Link>
                        </Button>
                    </div>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="gap-2"
                        onClick={() => void loginWithGoogle()}
                    >
                        <Sparkles className="h-4 w-4" />
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

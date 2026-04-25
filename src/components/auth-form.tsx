"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "register";

export function AuthForm({
    mode,
    redirectTarget,
}: {
    mode: AuthMode;
    redirectTarget: string;
}) {
    const router = useRouter();
    const { login, register, loginWithGoogle } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLogin = mode === "login";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ name, email, password });
            }
            router.push(redirectTarget); // Redirect after login/register
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        setIsSubmitting(true);
        try {
            await loginWithGoogle();
            router.push(redirectTarget);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-5xl mx-auto px-4 py-16 min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 w-full items-stretch">
                <div className="rounded-3xl border-2 border-border p-8 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] flex flex-col justify-between">
                    <div className="space-y-5">
                        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                            Frontend Auth Ready
                        </p>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                            {isLogin
                                ? "Login เพื่อเข้าถึงเครื่องมือพิเศษ"
                                : "Register เพื่อเตรียมระบบสมาชิก"}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            หน้านี้เป็น frontend flow พร้อมต่อ Express.js
                            backend ทีหลังได้เลย ตอนนี้มี email/password และ
                            Google auth button ให้ครบสำหรับ wiring ฝั่ง API
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-8">
                        <div className="rounded-2xl border-2 border-border bg-background/60 p-4">
                            <p className="font-semibold">Credential Auth</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                พร้อมเปลี่ยน submit handler ให้ยิง Express
                                endpoint
                            </p>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-background/60 p-4">
                            <p className="font-semibold">Google Auth</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                มีปุ่มและ frontend state ไว้ต่อ OAuth flow
                                จริงภายหลัง
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">
                            {isLogin ? "Login" : "Register"}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? "เข้าสู่ระบบเพื่อใช้เครื่องมือที่จำกัดสิทธิ์"
                                : "สร้างบัญชีสำหรับสมาชิกของไร้สาระ"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Peeratus"
                                        required
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isLogin ? "Login" : "Create account"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="w-full gap-2"
                            onClick={() => void handleGoogle()}
                            disabled={isSubmitting}
                        >
                            <Sparkles className="h-4 w-4" />
                            Google Auth
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            {isLogin ? "ยังไม่มีบัญชี? " : "มีบัญชีแล้ว? "}
                            <Link
                                href={isLogin ? "/register" : "/login"}
                                className="text-foreground font-semibold underline underline-offset-4"
                            >
                                {isLogin ? "Register" : "Login"}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

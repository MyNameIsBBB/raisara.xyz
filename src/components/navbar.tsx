"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    const pathname = usePathname();

    const routes = [
        {
            href: "/",
            label: "หน้าหลัก",
            active: pathname === "/",
        },
        {
            href: "/tools",
            label: "เครื่องมือ",
            active: pathname.startsWith("/tools"),
        },
        {
            href: "/chatbot",
            label: "แชทบอท",
            active: pathname === "/chatbot",
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl">ไร้สาระ</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    route.active
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}

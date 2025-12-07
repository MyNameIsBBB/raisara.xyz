"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bots } from "./data";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ChatbotMenuPage() {
    return (
        <div className="container max-w-5xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">
                    เลือกเพื่อนคุยของคุณ
                </h1>
                <p className="text-muted-foreground text-lg">
                    อยากคุยกับใคร เลือกได้เลย (แต่ระวังหน่อยนะ บางคนก็กวนประสาท)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                    <Link
                        key={bot.id}
                        href={bot.isAvailable ? `/chatbot/${bot.id}` : "#"}
                        className={cn(
                            "block transition-all duration-300 hover:scale-105",
                            !bot.isAvailable &&
                                "opacity-60 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                            <CardHeader className="text-center pb-2">
                                <div className="flex justify-center mb-4 ">
                                    {bot.avatar.startsWith("/") ? (
                                        <img
                                            src={bot.avatar}
                                            alt={bot.name}
                                            className="w-24 h-24 object-contain rounded-full"
                                        />
                                    ) : (
                                        <div className="text-6xl">
                                            {bot.avatar}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-xl">
                                    {bot.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    {bot.description}
                                </p>
                                {!bot.isAvailable && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-medium">
                                        Coming Soon
                                    </span>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

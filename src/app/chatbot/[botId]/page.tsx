"use client";

import { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, RefreshCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { bots } from "@/app/chatbot/data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage({
    params,
}: {
    params: Promise<{ botId: string }>;
}) {
    const { botId } = use(params);
    const bot = bots.find((b) => b.id === botId);

    if (!bot) {
        notFound();
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    botId: bot.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.details ||
                        errorData.error ||
                        "Failed to fetch response"
                );
            }

            const data = await response.json();
            const botMessage: Message = {
                role: "assistant",
                content: data.content,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: `ขอโทษนะ เกิดข้อผิดพลาด (Error: ${
                    error instanceof Error ? error.message : "Unknown error"
                }) ลองใหม่อีกครั้งนะ`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([]);
        setInput("");
    };

    return (
        <div className="container max-w-4xl mx-auto py-4 px-4 h-[calc(100dvh-4rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/chatbot">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="bg-primary/10 rounded-full flex items-center justify-center w-16 h-16 overflow-hidden border-2 border-primary/20">
                        {bot.avatar.startsWith("/") ? (
                            <img
                                src={bot.avatar}
                                alt={bot.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl">{bot.avatar}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{bot.name}</h1>
                        <p className="text-muted-foreground text-sm">
                            {bot.description}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    title="เริ่มใหม่"
                    className="border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" />
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-2">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8 opacity-50">
                            <div className="mb-4">
                                {bot.avatar.startsWith("/") ? (
                                    <img
                                        src={bot.avatar}
                                        alt={bot.name}
                                        className="w-32 h-32 object-contain rounded-full"
                                    />
                                ) : (
                                    <div className="text-6xl">{bot.avatar}</div>
                                )}
                            </div>
                            <p className="max-w-md">
                                สวัสดี! เราคือ {bot.name} <br />
                                {bot.description}
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex w-full",
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex gap-3 max-w-[80%]",
                                    message.role === "user"
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {message.role === "user" ? (
                                        <User className="w-5 h-5" />
                                    ) : bot.avatar.startsWith("/") ? (
                                        <img
                                            src={bot.avatar}
                                            alt={bot.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        bot.avatar
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "p-3 rounded-2xl text-sm",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none"
                                    )}
                                >
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 overflow-hidden">
                                    {bot.avatar.startsWith("/") ? (
                                        <img
                                            src={bot.avatar}
                                            alt={bot.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg">
                                            {bot.avatar}
                                        </span>
                                    )}
                                </div>
                                <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-background/50 backdrop-blur">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="พิมพ์ข้อความของคุณที่นี่..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}

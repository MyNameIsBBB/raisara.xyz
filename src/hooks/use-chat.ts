import { useState, useRef, useEffect } from "react";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export function useChat(botId: string) {
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
                    botId: botId,
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

    return {
        messages,
        input,
        setInput,
        isLoading,
        messagesEndRef,
        handleSubmit,
        handleReset,
    };
}

"use client";

import { use } from "react";
import { Card } from "@/components/ui/card";
import { bots } from "@/app/chatbot/data";
import { notFound } from "next/navigation";
import { useChat } from "@/hooks/use-chat";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";

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

    const {
        messages,
        input,
        setInput,
        isLoading,
        messagesEndRef,
        handleSubmit,
        handleReset,
    } = useChat(bot.id);

    return (
        <div className="container max-w-4xl mx-auto py-4 px-4 h-[calc(100dvh-4rem)] flex flex-col">
            <ChatHeader bot={bot} onReset={handleReset} />

            <Card className="flex-1 flex flex-col overflow-hidden border-2">
                <MessageList
                    messages={messages}
                    bot={bot}
                    isLoading={isLoading}
                    messagesEndRef={messagesEndRef}
                />
                <ChatInput
                    input={input}
                    setInput={setInput}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                />
            </Card>
        </div>
    );
}

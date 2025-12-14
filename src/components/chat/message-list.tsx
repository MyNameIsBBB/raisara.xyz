import { useRef } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-chat";

interface MessageListProps {
    messages: Message[];
    bot: {
        name: string;
        description: string;
        avatar: string;
    };
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({
    messages,
    bot,
    isLoading,
    messagesEndRef,
}: MessageListProps) {
    return (
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
                                <span className="text-lg">{bot.avatar}</span>
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
    );
}

import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ChatHeaderProps {
    bot: {
        name: string;
        description: string;
        avatar: string;
    };
    onReset: () => void;
    runtimeLabel: string;
}

export function ChatHeader({ bot, onReset, runtimeLabel }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Link href="/chatbot">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="bg-primary/10 rounded-full flex items-center justify-center w-16 h-16 overflow-hidden border-2 border-primary/20">
                    {bot.avatar.startsWith("/") ? (
                        <Image
                            src={bot.avatar}
                            alt={bot.name}
                            width={64}
                            height={64}
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
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                        {runtimeLabel}
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                title="เริ่มใหม่"
                className="border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
            >
                <RefreshCcw className="w-4 h-4" />
            </Button>
        </div>
    );
}

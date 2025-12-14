import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({
    input,
    setInput,
    isLoading,
    onSubmit,
}: ChatInputProps) {
    return (
        <div className="p-4 border-t bg-background/50 backdrop-blur">
            <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    );
}

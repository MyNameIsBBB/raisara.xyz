"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("message", message);
        if (file) {
            formData.append("file", file);
        }

        try {
            const res = await fetch("/api/report", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to send report");

            setSuccess(true);
            setMessage("");
            setFile(null);

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to send report, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="max-w-md w-full bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Send className="w-6 h-6 text-primary" />
                        Report Issue
                    </CardTitle>
                    <CardDescription>
                        Found a bug or have a suggestion? Let us know!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center py-12 text-green-500 animate-in fade-in zoom-in">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Send className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Thank You!
                            </h3>
                            <p className="text-muted-foreground">
                                Your report has been sent to our team.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => setSuccess(false)}
                            >
                                Send Another
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Message
                                </label>
                                <Textarea
                                    placeholder="Describe the issue or feature request..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="bg-background border-input min-h-[150px] resize-none focus-visible:ring-primary"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Attachment (Optional)
                                </label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0] || null)
                                    }
                                    className="bg-background border-input cursor-pointer file:cursor-pointer file:text-foreground file:bg-secondary file:border-0 file:rounded-md file:px-2 file:mr-4 hover:file:bg-secondary/80 transition-colors"
                                    accept="image/*"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPG, PNG, GIF
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Submit Report"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogViewerProps {
    logs: string[];
    converting: boolean;
}

export function LogViewer({ logs, converting }: LogViewerProps) {
    if (logs.length === 0 && !converting) return null;

    return (
        <Card className="bg-black/90 border-zinc-800 text-green-400 font-mono text-xs shadow-inner">
            <CardHeader className="py-2 px-4 border-b border-zinc-800">
                <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    FFmpeg Logs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-32 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                    <p key={i} className="break-all opacity-80">
                        {">"} {log}
                    </p>
                ))}
                {converting && <span className="animate-pulse">_</span>}
            </CardContent>
        </Card>
    );
}

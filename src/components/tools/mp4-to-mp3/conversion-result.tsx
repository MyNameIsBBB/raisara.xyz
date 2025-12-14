"use client";

import { FileAudio, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConversionResultProps {
    mp3Url: string | null;
}

export function ConversionResult({ mp3Url }: ConversionResultProps) {
    if (!mp3Url) return null;

    return (
        <Card className="bg-green-500/10 border-green-500/20 animate-in zoom-in-95">
            <CardContent className="flex flex-col items-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <FileAudio className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg text-foreground">
                        แปลงไฟล์สำเร็จ!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        ไฟล์ MP3 ของคุณพร้อมแล้ว
                    </p>
                </div>
                <audio controls src={mp3Url} className="w-full" />
                <a
                    href={mp3Url}
                    download="converted_audio.mp3"
                    className="w-full"
                >
                    <Button className="w-full" variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        ดาวน์โหลด
                    </Button>
                </a>
            </CardContent>
        </Card>
    );
}

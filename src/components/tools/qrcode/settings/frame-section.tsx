"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FrameSectionProps {
    handleFrameUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    frameUrl: string;
    setFrameUrl: (val: string) => void;
    qrSize: number;
}

export function FrameSection({
    handleFrameUpload,
    frameUrl,
    setFrameUrl,
    qrSize,
}: FrameSectionProps) {
    return (
        <div className="space-y-2 pt-4 border-t border-border">
            <Label htmlFor="frame">เทมเพลตกรอบ (PNG)</Label>
            <div className="space-y-3">
                <Input
                    id="frame"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFrameUpload}
                    className="cursor-pointer file:text-primary file:font-semibold"
                />
                {frameUrl && (
                    <div className="space-y-3">
                        <div className="relative h-32 w-full bg-secondary/30 rounded-lg border border-border flex items-center justify-center overflow-hidden">
                            <img
                                src={frameUrl}
                                alt="Frame"
                                className="h-full w-full object-contain"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 rounded-lg"
                                onClick={() => setFrameUrl("")}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            กรอบจะถูกปรับขนาดตามความละเอียด ({qrSize}x{qrSize})
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

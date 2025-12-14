"use client";

import { FileAudio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/tools/image-uploader";

interface ConversionFormProps {
    file: File | null;
    onFileSelect: (file: File) => void;
    convert: () => void;
    converting: boolean;
    progress: number;
}

export function ConversionForm({
    file,
    onFileSelect,
    convert,
    converting,
    progress,
}: ConversionFormProps) {
    return (
        <>
            {/* File Input */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <ImageUploader onFileSelect={onFileSelect} />
                {file && (
                    <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3 border border-border">
                        <FileAudio className="w-6 h-6 text-purple-500" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {file && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Button
                        onClick={convert}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="lg"
                        disabled={converting}
                    >
                        {converting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังแปลงไฟล์... {progress}%
                            </>
                        ) : (
                            "แปลงเป็น MP3"
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}

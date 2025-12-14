import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";

interface ImageComparisonProps {
    previewUrl: string | null;
    processedImage: string | null;
    isProcessing: boolean;
    error: string | null;
    onReset: () => void;
    onDownload: () => void;
}

export function ImageComparison({
    previewUrl,
    processedImage,
    isProcessing,
    error,
    onReset,
    onDownload,
}: ImageComparisonProps) {
    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    onClick={onReset}
                    disabled={isProcessing}
                >
                    <X className="mr-2 h-4 w-4" /> เริ่มใหม่
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium mb-2 text-center text-muted-foreground">
                            Original
                        </div>
                        <div className="relative flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden min-h-[300px]">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Original"
                                    className="max-w-full h-auto object-contain"
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Processed Image */}
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium mb-2 text-center text-muted-foreground">
                            Result
                        </div>
                        <div className="relative flex items-center justify-center rounded-lg overflow-hidden border min-h-[300px]">
                            {/* CSS Checkerboard Pattern */}
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                                    backgroundSize: "20px 20px",
                                    backgroundPosition:
                                        "0 0, 0 10px, 10px -10px, -10px 0px",
                                }}
                            />

                            {isProcessing ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        กำลังลบพื้นหลัง...
                                    </p>
                                </div>
                            ) : processedImage ? (
                                <img
                                    src={processedImage}
                                    alt="Processed"
                                    className="relative z-10 max-w-full h-auto object-contain"
                                />
                            ) : (
                                <div className="text-muted-foreground text-sm">
                                    Waiting...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {error && (
                <div className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {processedImage && (
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={onDownload}
                        className="w-full md:w-auto"
                    >
                        <Download className="mr-2 h-5 w-5" /> ดาวน์โหลดรูปภาพ
                    </Button>
                </div>
            )}
        </div>
    );
}

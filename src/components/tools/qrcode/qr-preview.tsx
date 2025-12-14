"use client";

import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { RefObject } from "react";

interface QrPreviewProps {
    url: string;
    logoUrl: string;
    frameUrl: string;
    qrSize: number;
    isQrTransparent: boolean;
    qrCanvasRef: RefObject<HTMLDivElement | null>;
    downloadQRCode: () => void;
}

export function QrPreview({
    url,
    logoUrl,
    frameUrl,
    qrSize,
    isQrTransparent,
    qrCanvasRef,
    downloadQRCode,
}: QrPreviewProps) {
    return (
        <Card className="border border-border/50 shadow-xl bg-card h-full flex flex-col justify-center items-center min-h-[600px] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-zinc-900/10 pointer-events-none" />

            <CardContent className="flex flex-col items-center justify-center space-y-8 py-12 relative z-10 w-full">
                <div className="relative group">
                    <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

                    <div
                        ref={qrCanvasRef}
                        className={`relative bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center ${
                            // If frameUrl exists, the container is resized to match.
                            // We use responsive styling here but the canvas inside is sized by QR size.
                            !frameUrl ? "p-8" : ""
                        }`}
                        // If transparent, we remove the white bg from the container
                        style={{
                            background: frameUrl
                                ? "transparent"
                                : isQrTransparent
                                ? "transparent"
                                : "white",
                            boxShadow:
                                isQrTransparent && !frameUrl
                                    ? "none"
                                    : undefined,
                        }}
                    >
                        {/* Frame Background Layer */}
                        {frameUrl && (
                            <div className="relative">
                                {/* Frame is BACKGROUND */}
                                <img
                                    src={frameUrl}
                                    alt="Frame"
                                    className="max-w-full max-h-[600px] object-contain block"
                                />
                                {/* QR Overlay Layer - Absolute positioned to fill the frame */}
                                {url && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <QRCodeCanvas
                                                value={url}
                                                size={qrSize}
                                                level={"H"}
                                                bgColor={
                                                    isQrTransparent
                                                        ? "transparent"
                                                        : "#FFFFFF"
                                                }
                                                includeMargin={true}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                imageSettings={
                                                    logoUrl
                                                        ? {
                                                              src: logoUrl,
                                                              x: undefined,
                                                              y: undefined,
                                                              height:
                                                                  qrSize * 0.2,
                                                              width:
                                                                  qrSize * 0.2,
                                                              excavate: true,
                                                          }
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Standard View (No Frame) */}
                        {!frameUrl && (
                            <>
                                {url ? (
                                    <QRCodeCanvas
                                        value={url}
                                        size={300} // Display size
                                        level={"H"}
                                        bgColor={
                                            isQrTransparent
                                                ? "transparent"
                                                : "#FFFFFF"
                                        }
                                        includeMargin={true}
                                        imageSettings={
                                            logoUrl
                                                ? {
                                                      src: logoUrl,
                                                      x: undefined,
                                                      y: undefined,
                                                      height: 60,
                                                      width: 60,
                                                      excavate: true,
                                                  }
                                                : undefined
                                        }
                                    />
                                ) : (
                                    <div className="w-[300px] h-[300px] bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-400 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                                        <Upload className="w-12 h-12 mb-4 opacity-50" />
                                        กรอก URL เพื่อสร้าง QR Code
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <Button
                    onClick={downloadQRCode}
                    disabled={!url}
                    size="lg"
                    className="w-full sm:w-auto min-w-[240px] h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Download className="w-5 h-5 mr-2" />
                    ดาวน์โหลด {frameUrl ? "QR พร้อมกรอบ" : "QR Code"}
                </Button>
            </CardContent>
        </Card>
    );
}

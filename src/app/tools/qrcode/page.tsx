"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QrCodePage() {
    const [url, setUrl] = useState("");
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="container py-20 max-w-5xl mx-auto px-4 min-h-[calc(100vh-3.5rem)]">
            <div className="mb-12 space-y-4 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                    แปลง Link เป็น QR Code
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    ใส่ลิงก์ที่คุณต้องการ แล้วดาวน์โหลด QR Code ไปใช้งานได้เลย
                    ง่ายๆ แค่นี้แหละ
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 items-start">
                <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <LinkIcon className="w-5 h-5" />
                            ใส่ลิงก์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="h-12 text-base"
                            />
                            <p className="text-sm text-muted-foreground">
                                พิมพ์หรือวางลิงก์ที่ต้องการแปลงเป็น QR Code
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card h-full">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            QR Code ของคุณ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
                        <div
                            ref={qrRef}
                            className="p-6 bg-white rounded-xl border-2 border-border shadow-sm"
                        >
                            {url ? (
                                <QRCodeCanvas
                                    value={url}
                                    size={240}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            ) : (
                                <div className="w-[240px] h-[240px] bg-muted/20 flex items-center justify-center text-muted-foreground text-sm rounded-lg border-2 border-dashed border-muted-foreground/20">
                                    รอรับลิงก์...
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={downloadQRCode}
                            disabled={!url}
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px] border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            ดาวน์โหลด QR Code
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

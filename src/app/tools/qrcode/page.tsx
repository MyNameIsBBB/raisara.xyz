"use client";

import { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { QrSettings } from "@/components/tools/qrcode/qr-settings";
import { QrPreview } from "@/components/tools/qrcode/qr-preview";

export default function QrCodePage() {
    const [url, setUrl] = useState("");

    // Logo State
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isRemovingBg, setIsRemovingBg] = useState(false);

    // Frame State
    const [frameUrl, setFrameUrl] = useState<string>("");

    // QR State
    const [qrSize, setQrSize] = useState(300); // Standard default size
    const [isQrTransparent, setIsQrTransparent] = useState(false);

    const qrCanvasRef = useRef<HTMLDivElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setLogoUrl(objectUrl);
        }
    };

    const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFrameUrl(objectUrl);
        }
    };

    const removeLogoBackground = async () => {
        if (!logoFile) return;
        try {
            setIsRemovingBg(true);
            const blob = await removeBackground(logoFile);
            const url = URL.createObjectURL(blob);
            setLogoUrl(url);
        } catch (error) {
            console.error("Failed to remove background", error);
            alert("ลบพื้นหลังล้มเหลว");
        } finally {
            setIsRemovingBg(false);
        }
    };

    const downloadQRCode = async () => {
        if (!url) return;

        const canvas = qrCanvasRef.current?.querySelector("canvas");
        if (!canvas) return;

        // Create a new canvas for the final composite
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = qrSize;
        finalCanvas.height = qrSize;
        const ctx = finalCanvas.getContext("2d");

        if (!ctx) return;

        // If there's a frame, draw it as background, SCALED to fit the QR size
        // "Frame resize to match qrcode size"
        if (frameUrl) {
            try {
                const frameImg = await loadImage(frameUrl);
                ctx.drawImage(frameImg, 0, 0, qrSize, qrSize);
            } catch (error) {
                console.error("Error loading frame for composition", error);
            }
        }

        // Draw the QR Code on top
        // The QR code from qrcode.react is already at the correct size visually,
        // but let's draw it precisely to fill the space
        ctx.drawImage(canvas, 0, 0, qrSize, qrSize);

        const pngUrl = finalCanvas.toDataURL("image/png");
        triggerDownload(pngUrl);
    };

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    const triggerDownload = (url: string) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="container py-12 max-w-6xl mx-auto px-4 min-h-[calc(100vh-3.5rem)]">
            <div className="mb-12 space-y-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    เครื่องมือสร้าง QR Code
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    สร้าง QR Code ที่ปรับแต่งได้พร้อมโลโก้และกรอบของคุณ
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-start">
                <div className="lg:col-span-4 space-y-6">
                    <QrSettings
                        url={url}
                        setUrl={setUrl}
                        logoUrl={logoUrl}
                        handleLogoUpload={handleLogoUpload}
                        removeLogoBackground={removeLogoBackground}
                        setLogoUrl={setLogoUrl}
                        setLogoFile={setLogoFile}
                        isRemovingBg={isRemovingBg}
                        handleFrameUpload={handleFrameUpload}
                        frameUrl={frameUrl}
                        setFrameUrl={setFrameUrl}
                        qrSize={qrSize}
                        setQrSize={setQrSize}
                        isQrTransparent={isQrTransparent}
                        setIsQrTransparent={setIsQrTransparent}
                    />
                </div>

                <div className="lg:col-span-8">
                    <QrPreview
                        url={url}
                        logoUrl={logoUrl}
                        frameUrl={frameUrl}
                        qrSize={qrSize}
                        isQrTransparent={isQrTransparent}
                        qrCanvasRef={qrCanvasRef}
                        downloadQRCode={downloadQRCode}
                    />
                </div>
            </div>
        </div>
    );
}

"use client";

import { Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlSection } from "@/components/tools/qrcode/settings/url-section";
import { QrOptionsSection } from "@/components/tools/qrcode/settings/qr-options-section";
import { FrameSection } from "@/components/tools/qrcode/settings/frame-section";
import { LogoSection } from "@/components/tools/qrcode/settings/logo-section";

interface QrSettingsProps {
    url: string;
    setUrl: (val: string) => void;
    logoUrl: string;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeLogoBackground: () => void;
    setLogoUrl: (val: string) => void;
    setLogoFile: (val: File | null) => void;
    isRemovingBg: boolean;
    handleFrameUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    frameUrl: string;
    setFrameUrl: (val: string) => void;
    qrSize: number;
    setQrSize: (val: number) => void;
    isQrTransparent: boolean;
    setIsQrTransparent: (val: boolean) => void;
}

export function QrSettings({
    url,
    setUrl,
    logoUrl,
    handleLogoUpload,
    removeLogoBackground,
    setLogoUrl,
    setLogoFile,
    isRemovingBg,
    handleFrameUpload,
    frameUrl,
    setFrameUrl,
    qrSize,
    setQrSize,
    isQrTransparent,
    setIsQrTransparent,
}: QrSettingsProps) {
    return (
        <Card className="border border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    เนื้อหาและการตั้งค่า
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <UrlSection url={url} setUrl={setUrl} />

                <QrOptionsSection
                    qrSize={qrSize}
                    setQrSize={setQrSize}
                    isQrTransparent={isQrTransparent}
                    setIsQrTransparent={setIsQrTransparent}
                />

                <FrameSection
                    handleFrameUpload={handleFrameUpload}
                    frameUrl={frameUrl}
                    setFrameUrl={setFrameUrl}
                    qrSize={qrSize}
                />

                <LogoSection
                    logoUrl={logoUrl}
                    handleLogoUpload={handleLogoUpload}
                    removeLogoBackground={removeLogoBackground}
                    setLogoUrl={setLogoUrl}
                    setLogoFile={setLogoFile}
                    isRemovingBg={isRemovingBg}
                />
            </CardContent>
        </Card>
    );
}

"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { AlertModal } from "@/components/ui/alert-modal";
import { ImageUploader } from "@/components/tools/image-uploader";
import { ImageComparison } from "@/components/tools/image-comparison";

export default function BgRemoverPage() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertDesc, setAlertDesc] = useState("");

    const processFile = async (file: File) => {
        if (file.size > 50 * 1024 * 1024) {
            setAlertTitle("ไฟล์มีขนาดใหญ่เกินไป");
            setAlertDesc("กรุณาอัปโหลดรูปภาพที่มีขนาดไม่เกิน 50MB");
            setAlertOpen(true);
            return;
        }

        // Reset state
        setImage(file);
        setProcessedImage(null);
        setError(null);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Start processing automatically
        await handleBackgroundRemoval(file);
    };

    const handleBackgroundRemoval = async (file: File) => {
        try {
            setIsProcessing(true);
            // removeBackground is the imported function
            const blob = await removeBackground(file);
            console.log("Background removal result (blob):", blob);

            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (err) {
            console.error("Background removal failed:", err);
            setError("ไม่สามารถลบพื้นหลังได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (processedImage) {
            const link = document.createElement("a");
            link.href = processedImage;
            link.download = "raisara-bg-removed.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const reset = () => {
        setImage(null);
        setPreviewUrl(null);
        setProcessedImage(null);
        setError(null);
    };

    return (
        <div className="container max-w-5xl mx-auto py-20 px-4">
            <AlertModal
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                title={alertTitle}
                description={alertDesc}
            />
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    ลบพื้นหลังรูปภาพ
                </h1>
                <p className="text-xl text-muted-foreground">
                    อัปโหลดรูปภาพของคุณเพื่อลบพื้นหลังด้วย AI ฟรี
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                {!image ? (
                    <ImageUploader onFileSelect={processFile} />
                ) : (
                    <ImageComparison
                        previewUrl={previewUrl}
                        processedImage={processedImage}
                        isProcessing={isProcessing}
                        error={error}
                        onReset={reset}
                        onDownload={handleDownload}
                    />
                )}
            </div>
        </div>
    );
}

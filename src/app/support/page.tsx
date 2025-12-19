"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronDown,
    ChevronUp,
    Upload,
    CreditCard,
    Loader2,
} from "lucide-react";
import jsQR from "jsqr";
import { AlertModal } from "@/components/ui/alert-modal";

export default function SupportPage() {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [alert, setAlert] = useState<{
        isOpen: boolean;
        title: string;
        desc: string;
    }>({
        isOpen: false,
        title: "",
        desc: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setSlipFile(null);
            return;
        }

        // Verify QR Code
        const isValid = await verifySlipQRCode(file);
        if (isValid) {
            setSlipFile(file);
        } else {
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSlipFile(null);
            setAlert({
                isOpen: true,
                title: "ไม่พบ QR Code",
                desc: "กรุณาอัปโหลดรูปภาพสลิปที่มี QR Code เพื่อตรวจสอบความถูกต้อง",
            });
        }
    };

    const verifySlipQRCode = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    if (!context) {
                        resolve(false);
                        return;
                    }
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = context.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    const code = jsQR(
                        imageData.data,
                        imageData.width,
                        imageData.height
                    );

                    // Basic verification: just check if ANY QR code exists
                    resolve(!!code);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
        if (!slipFile) {
            setAlert({
                isOpen: true,
                title: "ข้อมูลไม่ครบถ้วน",
                desc: "กรุณาแนบสลิปการโอนเงิน",
            });
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("slip", slipFile);
        formData.append("message", message);

        try {
            const res = await fetch("/api/support", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            setAlert({
                isOpen: true,
                title: "ส่งข้อมูลสำเร็จ",
                desc: "ขอบคุณสำหรับการสนับสนุน! เราได้รับข้อมูลของท่านแล้ว",
            });

            // Reset form
            setMessage("");
            setSlipFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error(error);
            setAlert({
                isOpen: true,
                title: "เกิดข้อผิดพลาด",
                desc: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-lg px-4 py-8">
            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                title={alert.title}
                description={alert.desc}
            />

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        สนับสนุนเรา
                    </h1>
                    <p className="text-muted-foreground">
                        ขอบคุณที่สนับสนุนผลงานของเรา
                    </p>
                </div>

                {/* Animated Payment Section */}
                <Card className="overflow-hidden border-2 border-primary/20">
                    <div
                        className="bg-primary/5 p-4 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                    >
                        <div className="flex items-center gap-2 font-semibold">
                            <CreditCard className="w-5 h-5" />
                            <span>เปิด QR Code เลี้ยงกาแฟ</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            {isPaymentOpen ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    <div
                        className={`grid transition-all duration-300 ease-in-out ${
                            isPaymentOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                        <div className="overflow-hidden">
                            <CardContent className="pt-6 flex flex-col items-center gap-4">
                                {/* Placeholder for QR Code */}
                                <div className="w-64 h-64 bg-white p-4 rounded-xl shadow-sm border flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <img
                                                src="image/support.jpg"
                                                alt="QR Code"
                                            />
                                        </div>
                                        <p className="text-xs text-black font-mono">
                                            220-1-06094-2
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-center text-muted-foreground px-4">
                                    สแกน QR Code สำหรับเลี้ยงกาแฟ
                                    <br />
                                    <span className="font-semibold text-foreground">
                                        ชื่อบัญชี: พีรทัศน์ วิจิตรจรัลรุ่ง
                                    </span>
                                </p>
                            </CardContent>
                        </div>
                    </div>
                </Card>

                {/* Upload Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            ส่งหลักฐานพร้อม สิ่งที่อยากให้อ่าน
                        </CardTitle>
                        <CardDescription>
                            ส่งสลิปการโอนเงินและข้อความถึงบอท
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slip">
                                สลิปการโอนเงิน (ต้องมี QR Code)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="slip"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">
                                ข้อความที่อยากให้อ่าน
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full gap-2"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            ส่งข้อมูล
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

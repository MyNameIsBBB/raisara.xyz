"use client";

import { X, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoSectionProps {
    logoUrl: string;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeLogoBackground: () => void;
    setLogoUrl: (val: string) => void;
    setLogoFile: (val: File | null) => void;
    isRemovingBg: boolean;
}

export function LogoSection({
    logoUrl,
    handleLogoUpload,
    removeLogoBackground,
    setLogoUrl,
    setLogoFile,
    isRemovingBg,
}: LogoSectionProps) {
    return (
        <div className="space-y-2 pt-4 border-t border-border">
            <Label htmlFor="logo">โลโก้ (ไม่บังคับ)</Label>
            <div className="space-y-3">
                <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer file:text-primary file:font-semibold"
                />

                {logoUrl && (
                    <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg border border-border">
                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-white/10 shrink-0">
                            {/* Checkerboard bg for transparency check */}
                            <div className="absolute inset-0 bg-[url('https://t3.ftcdn.net/jpg/03/76/74/78/360_F_376747823_L8i8h8h6H1Q7qjW2t6h1h2h6h1h2h6h1.jpg')] bg-cover opacity-20 pointer-events-none" />
                            <img
                                src={logoUrl}
                                alt="ตัวอย่างโลโก้"
                                className="w-full h-full object-contain relative z-10"
                            />
                        </div>
                        <div className="flex-1">
                            <Button
                                onClick={removeLogoBackground}
                                variant="secondary"
                                size="sm"
                                className="w-full text-xs"
                                disabled={isRemovingBg}
                            >
                                {isRemovingBg ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                        กำลังลบพื้นหลัง...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-3 h-3 mr-2" />
                                        ลบพื้นหลัง (AI)
                                    </>
                                )}
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setLogoUrl("");
                                setLogoFile(null);
                            }}
                            className="shrink-0 h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

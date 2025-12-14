"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface QrOptionsSectionProps {
    qrSize: number;
    setQrSize: (val: number) => void;
    isQrTransparent: boolean;
    setIsQrTransparent: (val: boolean) => void;
}

export function QrOptionsSection({
    qrSize,
    setQrSize,
    isQrTransparent,
    setIsQrTransparent,
}: QrOptionsSectionProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                <Label htmlFor="transparent-qr" className="cursor-pointer">
                    พื้นหลังโปร่งใส
                </Label>
                <Switch
                    id="transparent-qr"
                    checked={isQrTransparent}
                    onCheckedChange={setIsQrTransparent}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <Label>ความละเอียด (px)</Label>
                    <span>{qrSize}px</span>
                </div>
                <Slider
                    value={[qrSize]}
                    onValueChange={(vals) => setQrSize(vals[0])}
                    min={100}
                    max={1000}
                    step={10}
                />
            </div>
        </div>
    );
}

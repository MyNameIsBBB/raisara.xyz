"use client";

import { useSearchParams } from "next/navigation";
import P2PSenderView from "@/components/tools/p2p/sender-view";
import P2PReceiverView from "@/components/tools/p2p/receiver-view";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function ImageToQrContent() {
    const searchParams = useSearchParams();
    const peerId = searchParams.get("id");

    if (peerId) {
        return <P2PReceiverView targetPeerId={peerId} />;
    }

    return (
        <div className="container max-w-4xl mx-auto py-20 px-4">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    ส่งรูปภาพผ่าน QR Code (WebRTC)
                </h1>
                <p className="text-xl text-muted-foreground">
                    ส่งรูปภาพขนาดใหญ่แค่ไหนก็ได้ แบบ P2P ไม่ผ่าน Server
                </p>
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg inline-block max-w-2xl">
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                        ใช้เทคโนโลยี WebRTC
                        ทำให้เครื่องของคุณและผู้รับเชื่อมต่อกันโดยตรง
                        <br />
                        ไม่จำกัดขนาดไฟล์, ปลอดภัย (ไม่เก็บไฟล์บน Server),
                        รวดเร็ว
                    </p>
                </div>
            </div>

            <P2PSenderView />
        </div>
    );
}

export default function ImageToQrPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            }
        >
            <ImageToQrContent />
        </Suspense>
    );
}

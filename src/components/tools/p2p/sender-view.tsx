"use client";

import { useState, useRef, useEffect } from "react";
import { ImageUploader } from "@/components/tools/image-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Loader2, Zap, Smartphone, CheckCircle } from "lucide-react";
import Peer, { DataConnection } from "peerjs";

export default function SenderView() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [peerId, setPeerId] = useState<string | null>(null);
    const [status, setStatus] = useState<
        "idle" | "ready" | "connecting" | "sending" | "done"
    >("idle");
    const [progress, setProgress] = useState(0);

    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    // Initialize Peer when file is selected
    useEffect(() => {
        if (file && !peerRef.current) {
            const newPeer = new Peer();

            newPeer.on("open", (id) => {
                setPeerId(id);
                setStatus("ready");
            });

            newPeer.on("connection", (conn) => {
                connRef.current = conn;
                setStatus("connecting");

                conn.on("open", () => {
                    // Send file immediately upon connection
                    sendFile(conn);
                });
            });

            peerRef.current = newPeer;
        }

        return () => {
            // Cleanup on unmount or file change if needed
            // peerRef.current?.destroy();
        };
    }, [file]);

    const sendFile = (conn: DataConnection) => {
        if (!file) return;
        setStatus("sending");

        // Simple send for now. For huge files, chunking might be needed but PeerJS handles blobs well usually.
        conn.send({
            file: file,
            filename: file.name,
            type: file.type,
            size: file.size,
        });

        setStatus("done");

        // Close connection after short delay
        setTimeout(() => {
            // conn.close();
        }, 5000);
    };

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        // Reset peer if exists to get new ID? Or reuse?
        // For simplicity, let's keep one session per upload for now unless reset.
    };

    const reset = () => {
        peerRef.current?.destroy();
        peerRef.current = null;
        setFile(null);
        setPreviewUrl(null);
        setPeerId(null);
        setStatus("idle");
    };

    const getShareUrl = () => {
        if (!peerId) return "";
        return `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${peerId}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {!file ? (
                <div className="max-w-xl mx-auto">
                    <ImageUploader onFileSelect={handleFileSelect} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Image Preview */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
                        <CardHeader>
                            <CardTitle>รูปภาพต้นฉบับ</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center p-6 bg-secondary/20 min-h-[300px] items-center">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-[400px] rounded-lg shadow-md object-contain"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: QR & Status */}
                    <Card className="bg-card border-border shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-primary" />
                                สแกนเพื่อรับรูปภาพ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 flex flex-col items-center">
                            {status === "idle" || !peerId ? (
                                <div className="py-10 flex flex-col items-center text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <p>กำลังสร้างห้อง...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white p-4 rounded-xl shadow-inner">
                                        <QRCodeCanvas
                                            value={getShareUrl()}
                                            size={220}
                                            level="L"
                                            includeMargin={true}
                                        />
                                    </div>

                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                สถานะ:
                                            </span>
                                            <span
                                                className={`text-sm font-bold flex items-center gap-2 ${
                                                    status === "done"
                                                        ? "text-green-500"
                                                        : status === "sending"
                                                        ? "text-yellow-500"
                                                        : status ===
                                                          "connecting"
                                                        ? "text-blue-500"
                                                        : "text-primary"
                                                }`}
                                            >
                                                {status === "ready" &&
                                                    "รอการเชื่อมต่อ..."}
                                                {status === "connecting" &&
                                                    "กำลังเชื่อมต่อ..."}
                                                {status === "sending" &&
                                                    "กำลังส่งไฟล์..."}
                                                {status === "done" && (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />{" "}
                                                        ส่งสำเร็จ
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {status === "ready" && (
                                            <p className="text-xs text-center text-muted-foreground animate-pulse">
                                                เปิดกล้องมือถือแล้วสแกน QR Code
                                                เพื่อรับไฟล์ได้ทันที <br />
                                                (Peer-to-Peer ไม่ผ่าน Server)
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <Button
                                variant="outline"
                                onClick={reset}
                                className="w-full"
                            >
                                เริ่มใหม่ / ยกเลิก
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

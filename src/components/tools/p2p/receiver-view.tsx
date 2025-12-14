"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertCircle, Wifi } from "lucide-react";
import Peer, { DataConnection } from "peerjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReceiverViewProps {
    targetPeerId: string;
}

export default function ReceiverView({ targetPeerId }: ReceiverViewProps) {
    const [status, setStatus] = useState<
        "connecting" | "connected" | "receiving" | "done" | "error"
    >("connecting");
    const [receivedImage, setReceivedImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("image.png");
    const [error, setError] = useState<string | null>(null);

    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    useEffect(() => {
        if (!targetPeerId) {
            setError("Invalid Link: No Peer ID found.");
            setStatus("error");
            return;
        }

        const newPeer = new Peer();

        newPeer.on("open", () => {
            // Connect to sender
            const conn = newPeer.connect(targetPeerId);
            connRef.current = conn;

            conn.on("open", () => {
                setStatus("connected");
            });

            conn.on("data", (data: any) => {
                setStatus("receiving");
                if (data.file) {
                    // Blob received
                    const blob = new Blob([data.file], { type: data.type });
                    const url = URL.createObjectURL(blob);
                    setReceivedImage(url);
                    setFileName(data.filename || "image.png");
                    setStatus("done");
                }
            });

            conn.on("error", (err) => {
                console.error("Connection error:", err);
                setError("Connection lost or failed.");
                setStatus("error");
            });

            conn.on("close", () => {
                if (status !== "done") {
                    // If closed before done, might be an error or sender left
                }
            });
        });

        newPeer.on("error", (err) => {
            console.error("Peer error:", err);
            // Common error: peer-unavailable
            if (err.type === "peer-unavailable") {
                setError(
                    "ไม่พบผู้ส่ง หรือผู้ส่งปิดหน้านั้นไปแล้ว (Peer Unavailable)"
                );
            } else {
                setError("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.type);
            }
            setStatus("error");
        });

        peerRef.current = newPeer;

        return () => {
            peerRef.current?.destroy();
        };
    }, [targetPeerId]);

    const handleDownload = () => {
        if (receivedImage) {
            const link = document.createElement("a");
            link.href = receivedImage;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-md mx-auto py-10 px-4 animate-in fade-in zoom-in-95 duration-500">
            <Card className="bg-card border-border shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wifi
                            className={`w-5 h-5 ${
                                status === "error"
                                    ? "text-destructive"
                                    : "text-primary animate-pulse"
                            }`}
                        />
                        {status === "done"
                            ? "ได้รับไฟล์แล้ว"
                            : "กำลังเชื่อมต่อ..."}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {status === "connecting" && (
                        <div className="flex flex-col items-center py-10 text-muted-foreground">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                            <p>กำลังค้นหาและเชื่อมต่อกับผู้ส่ง...</p>
                        </div>
                    )}

                    {status === "connected" && (
                        <div className="flex flex-col items-center py-10 text-blue-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p>เชื่อมต่อสำเร็จ! กำลังรอไฟล์...</p>
                        </div>
                    )}

                    {status === "receiving" && (
                        <div className="flex flex-col items-center py-10 text-yellow-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p>กำลังดาวน์โหลดไฟล์...</p>
                        </div>
                    )}

                    {status === "done" && receivedImage && (
                        <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden border border-border shadow-md">
                                <img
                                    src={receivedImage}
                                    alt="Received"
                                    className="w-full h-auto"
                                />
                            </div>
                            <Button
                                onClick={handleDownload}
                                className="w-full"
                                size="lg"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                บันทึกรูปภาพ
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                ไฟล์ถูกส่งตรงจากผู้ส่ง (P2P) ไม่ผ่าน Server
                            </p>
                        </div>
                    )}

                    {status === "error" && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                            <AlertDescription>
                                {error}
                                <div className="mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.reload()}
                                    >
                                        ลองใหม่
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

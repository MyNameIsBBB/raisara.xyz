"use client";

import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EngineStatusProps {
    loaded: boolean;
    isLoading: boolean;
    load: () => void;
}

export function EngineStatus({ loaded, isLoading, load }: EngineStatusProps) {
    if (loaded) return null;

    return (
        <Card className="bg-card border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-center">เตรียมพร้อมใช้งาน</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <p className="mb-6 text-muted-foreground text-center">
                    จำเป็นต้องโหลด Engine (FFmpeg WASM) ก่อนเริ่มใช้งาน <br />
                    (ใช้เวลาสักครู่ในการโหลดครั้งแรก)
                </p>
                <Button
                    onClick={load}
                    size="lg"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังโหลด Engine...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            โหลด Engine
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

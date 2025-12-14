"use client";

import React, { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export function AlertModal({
    isOpen,
    onClose,
    title,
    description,
}: AlertModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="fixed inset-0" onClick={onClose}></div>
            <Card className="w-[90%] max-w-md z-50 relative animate-in zoom-in-95 duration-200 border-red-200 dark:border-red-900 bg-background shadow-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-6 w-6" />
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                    <CardDescription className="pt-2 text-base">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end pt-2">
                    <Button
                        onClick={onClose}
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        ตกลง
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

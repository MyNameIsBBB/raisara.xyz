"use client";

import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Components
import { EngineStatus } from "@/components/tools/mp4-to-mp3/engine-status";
import { ConversionForm } from "@/components/tools/mp4-to-mp3/conversion-form";
import { LogViewer } from "@/components/tools/mp4-to-mp3/log-viewer";
import { ConversionResult } from "@/components/tools/mp4-to-mp3/conversion-result";

export default function Mp4ToMp3Page() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mp3Url, setMp3Url] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // FFmpeg instance persistence
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const load = async () => {
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on("log", ({ message }) => {
            setLogs((prev) => [...prev.slice(-4), message]); // Keep last 5 lines
            if (messageRef.current) messageRef.current.innerHTML = message;
        });

        ffmpeg.on("progress", ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.js`,
                    "text/javascript"
                ),
                wasmURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.wasm`,
                    "application/wasm"
                ),
            });
            setLoaded(true);
        } catch (error) {
            console.error(error);
            setLogs((prev) => [...prev, "Error loading FFmpeg engine"]);
        } finally {
            setIsLoading(false);
        }
    };

    const convert = async () => {
        setConverting(true);
        setMp3Url(null);
        const ffmpeg = ffmpegRef.current;

        try {
            if (!file) return;

            await ffmpeg.writeFile("input.mp4", await fetchFile(file));

            await ffmpeg.exec(["-i", "input.mp4", "output.mp3"]);

            const data = await ffmpeg.readFile("output.mp3");
            const url = URL.createObjectURL(
                new Blob([data as unknown as BlobPart], { type: "audio/mp3" })
            );
            setMp3Url(url);
        } catch (error) {
            console.error(error);
            setLogs((prev) => [...prev, "Conversion failed"]);
        } finally {
            setConverting(false);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setMp3Url(null);
        setProgress(0);
        setLogs([]);
    };

    return (
        <div className="container max-w-4xl mx-auto py-20 px-4">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    แปลงไฟล์ MP4 เป็น MP3
                </h1>
                <p className="text-xl text-muted-foreground">
                    แปลงไฟล์วิดีโอเป็นเสียงคุณภาพสูง ทำงานบนเครื่องของคุณ 100%
                    (Client-side)
                </p>
            </div>

            <div className="max-w-xl mx-auto space-y-8">
                {/* 1. Engine Loader */}
                <EngineStatus
                    loaded={loaded}
                    isLoading={isLoading}
                    load={load}
                />

                {/* 2. Main Interface (only when loaded) */}
                {loaded && (
                    <>
                        <ConversionForm
                            file={file}
                            onFileSelect={handleFileSelect}
                            convert={convert}
                            converting={converting}
                            progress={progress}
                        />

                        <LogViewer logs={logs} converting={converting} />

                        <ConversionResult mp3Url={mp3Url} />
                    </>
                )}
            </div>
        </div>
    );
}

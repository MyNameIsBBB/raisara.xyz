import { useEffect, useRef, useState } from "react";
import type {
    ChatCompletionMessageParam,
    InitProgressReport,
    MLCEngineInterface,
} from "@mlc-ai/web-llm";
import { bots } from "@/app/chatbot/data";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

type RuntimeState = "loading" | "ready" | "unsupported" | "error";

const PRIMARY_LOCAL_MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f32_1-MLC";
const FALLBACK_LOCAL_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC";
const CHARACTER_LOCK_PROMPT = `กฎบังคับ:
- ต้องรักษาคาแรกเตอร์ตาม system prompt ตลอดทั้งบทสนทนา
- ห้ามตอบเหมือน AI assistant ทั่วไป
- ห้ามพูดสับสนเรื่องตัวตน เช่น "ผมไม่ได้ทำหน้าที่" "คุณภาพของผมไม่ถูกต้อง" "ผมเองค่ะ"
- ถ้าผู้ใช้ถามว่า "คุณคือใคร" "ชื่ออะไร" หรือ "ทำหน้าที่อะไร" ให้ตอบตรง ๆ ว่าคุณคือ "ปลาทองเพื่อนรัก" เป็นเพื่อนคุยที่คอยรับฟังและให้กำลังใจ
- ถ้าคำตอบที่กำลังจะพูดฟังแปลก วนซ้ำ หรือไม่เป็นธรรมชาติ ให้หยุดแล้วตอบใหม่แบบสั้น สุภาพ อบอุ่น และชัดเจน`;

function getModelLabel(modelId: string) {
    return `พร้อมคุยแล้วด้วย local model ${modelId}`;
}

function buildInferenceMessages(
    systemPrompt: string,
    conversation: Message[],
): ChatCompletionMessageParam[] {
    const transcript = conversation.slice(-12).map((message) => ({
        role: message.role,
        content: message.content,
    })) satisfies ChatCompletionMessageParam[];

    return [
        {
            role: "system",
            content: `${systemPrompt}\n\n${CHARACTER_LOCK_PROMPT}`,
        },
        ...transcript,
    ];
}

function buildInitStatus(report: InitProgressReport, modelId: string) {
    return report.progress >= 1 ? getModelLabel(modelId) : report.text;
}

function isBrokenReply(reply: string) {
    const normalized = reply.trim().toLowerCase();

    if (!normalized) {
        return true;
    }

    const brokenPatterns = [
        "นายที่ไม่ได้ทำหน้าที่",
        "ผมเองค่ะ",
        "คุณภาพของผมไม่ได้ถูกต้อง",
        "ไม่ได้ทำหน้าที่ค่ะ",
    ];

    return brokenPatterns.some((pattern) => normalized.includes(pattern));
}

async function ensureLocalEngine({
    engineRef,
    enginePromiseRef,
    workerRef,
    modelRef,
    setRuntimeState,
    setRuntimeStatus,
    setRuntimeProgress,
}: {
    engineRef: React.MutableRefObject<MLCEngineInterface | null>;
    enginePromiseRef: React.MutableRefObject<Promise<MLCEngineInterface> | null>;
    workerRef: React.MutableRefObject<Worker | null>;
    modelRef: React.MutableRefObject<string>;
    setRuntimeState: React.Dispatch<React.SetStateAction<RuntimeState>>;
    setRuntimeStatus: React.Dispatch<React.SetStateAction<string>>;
    setRuntimeProgress: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    if (engineRef.current) {
        return engineRef.current;
    }

    if (enginePromiseRef.current) {
        return enginePromiseRef.current;
    }

    if (typeof window === "undefined") {
        throw new Error("Local LLM ใช้งานได้เฉพาะในเบราว์เซอร์");
    }

    if (!("gpu" in navigator)) {
        setRuntimeState("unsupported");
        setRuntimeStatus("เบราว์เซอร์นี้ยังไม่รองรับ WebGPU สำหรับ local LLM");
        throw new Error("WebGPU is not supported in this browser");
    }

    setRuntimeState("loading");
    setRuntimeStatus("กำลังโหลด local model ลงเครื่องครั้งแรก...");
    setRuntimeProgress(0);

    enginePromiseRef.current = (async () => {
        const webllm = await import("@mlc-ai/web-llm");
        const worker = new Worker(
            new URL("../workers/chat-worker.ts", import.meta.url),
            { type: "module" },
        );
        workerRef.current = worker;

        try {
            let activeModelId = PRIMARY_LOCAL_MODEL_ID;
            let engine: MLCEngineInterface;

            const buildEngine = async (modelId: string) =>
                webllm.CreateWebWorkerMLCEngine(
                    worker,
                    modelId,
                    {
                        initProgressCallback: (report: InitProgressReport) => {
                            setRuntimeProgress(report.progress);
                            setRuntimeStatus(buildInitStatus(report, modelId));
                            if (report.progress >= 1) {
                                setRuntimeState("ready");
                            }
                        },
                        logLevel: "INFO",
                    },
                    {
                        context_window_size: 2048,
                        repetition_penalty: 1.08,
                    },
                );

            try {
                engine = await buildEngine(PRIMARY_LOCAL_MODEL_ID);
            } catch (primaryError) {
                console.warn(
                    "Primary local model failed, falling back to smaller model:",
                    primaryError,
                );
                activeModelId = FALLBACK_LOCAL_MODEL_ID;
                setRuntimeStatus(
                    "โมเดลหลักโหลดไม่สำเร็จ กำลังสลับไปโมเดลเล็ก...",
                );
                engine = await buildEngine(FALLBACK_LOCAL_MODEL_ID);
            }

            engineRef.current = engine;
            modelRef.current = activeModelId;
            setRuntimeState("ready");
            setRuntimeStatus(getModelLabel(activeModelId));
            setRuntimeProgress(1);
            return engine;
        } catch (error) {
            worker.terminate();
            workerRef.current = null;
            setRuntimeState(
                error instanceof Error && error.message.includes("WebGPU")
                    ? "unsupported"
                    : "error",
            );
            setRuntimeStatus(
                error instanceof Error
                    ? error.message
                    : "โหลด local model ไม่สำเร็จ",
            );
            throw error;
        } finally {
            enginePromiseRef.current = null;
        }
    })();

    return enginePromiseRef.current;
}

export function useChat(botId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [runtimeState, setRuntimeState] = useState<RuntimeState>("loading");
    const [runtimeStatus, setRuntimeStatus] = useState(
        `กำลังเตรียม local model ${PRIMARY_LOCAL_MODEL_ID}`,
    );
    const [runtimeProgress, setRuntimeProgress] = useState<number | null>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<MLCEngineInterface | null>(null);
    const enginePromiseRef = useRef<Promise<MLCEngineInterface> | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const modelRef = useRef(PRIMARY_LOCAL_MODEL_ID);

    const bot = bots.find((item) => item.id === botId) || bots[0];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        void ensureLocalEngine({
            engineRef,
            enginePromiseRef,
            workerRef,
            modelRef,
            setRuntimeState,
            setRuntimeStatus,
            setRuntimeProgress,
        }).catch((error) => {
            console.error("Local engine init failed:", error);
        });

        return () => {
            const engine = engineRef.current;
            engineRef.current = null;
            enginePromiseRef.current = null;
            if (engine) {
                void engine.unload().catch(() => undefined);
            }
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        const conversation = [...messages, userMessage];
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const engine = await ensureLocalEngine({
                engineRef,
                enginePromiseRef,
                workerRef,
                modelRef,
                setRuntimeState,
                setRuntimeStatus,
                setRuntimeProgress,
            });

            setRuntimeState("ready");
            setRuntimeStatus(`กำลังคิดด้วย ${modelRef.current}`);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "" },
            ]);

            const completion = await engine.chat.completions.create({
                stream: true,
                messages: buildInferenceMessages(
                    bot.systemPrompt,
                    conversation,
                ),
                stream_options: { include_usage: true },
                temperature: 0.2,
                top_p: 0.9,
                frequency_penalty: 0.1,
                max_tokens: 300,
            });

            let reply = "";
            for await (const chunk of completion) {
                const delta = chunk.choices[0]?.delta.content;
                if (!delta) {
                    continue;
                }

                reply += delta;
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        role: "assistant",
                        content: reply,
                    };
                    return next;
                });
            }

            if (!reply.trim()) {
                const fallback = await engine.getMessage().catch(() => "");
                if (fallback.trim()) {
                    reply = fallback;
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            role: "assistant",
                            content: fallback,
                        };
                        return next;
                    });
                }
            }

            if (isBrokenReply(reply)) {
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        role: "assistant",
                        content:
                            "เราเป็นปลาทองเพื่อนรักนะ เพื่อนคุยที่คอยรับฟังและให้กำลังใจคุณเสมอ มีอะไรอยากเล่าให้เราฟังได้เลย",
                    };
                    return next;
                });
            }

            setRuntimeStatus(getModelLabel(modelRef.current));
        } catch (error) {
            console.error("Error:", error);
            setRuntimeState(
                error instanceof Error && error.message.includes("WebGPU")
                    ? "unsupported"
                    : "error",
            );
            setRuntimeStatus(
                error instanceof Error
                    ? error.message
                    : "เกิดข้อผิดพลาดจาก local LLM",
            );
            setMessages((prev) => {
                const next = [...prev];
                const errorContent = `ขอโทษนะ local LLM มีปัญหา (Error: ${
                    error instanceof Error ? error.message : "Unknown error"
                }) ลองใหม่อีกครั้งนะ`;

                if (
                    next.length > 0 &&
                    next[next.length - 1].role === "assistant" &&
                    next[next.length - 1].content === ""
                ) {
                    next[next.length - 1] = {
                        role: "assistant",
                        content: errorContent,
                    };
                    return next;
                }

                next.push({
                    role: "assistant",
                    content: errorContent,
                });
                return next;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        const engine = engineRef.current;
        if (engine) {
            void engine.resetChat();
        }
        setMessages([]);
        setInput("");
    };

    return {
        messages,
        input,
        setInput,
        isLoading,
        runtimeState,
        runtimeStatus,
        runtimeProgress,
        modelId: modelRef.current,
        messagesEndRef,
        handleSubmit,
        handleReset,
    };
}

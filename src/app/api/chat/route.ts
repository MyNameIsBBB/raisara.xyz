import { NextResponse } from "next/server";
import OpenAI from "openai";
import { bots } from "@/app/chatbot/data";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, botId } = body;

        if (!messages) {
            return new NextResponse("Missing messages", { status: 400 });
        }

        const bot = bots.find((b) => b.id === botId) || bots[0]; // Default to Goldfish

        const apiKey = process.env.TYPHOON_API_KEY;
        const baseURL = "https://api.opentyphoon.ai/v1";

        // Mock response if no API key is provided
        if (!apiKey) {
            console.warn("No TYPHOON_API_KEY found. Using mock response.");
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockResponses = [
                "เราจำไม่ได้แล้วว่าเมื่อกี้คุยอะไรกัน แต่เราพร้อมฟังเสมอนะ",
                "เรื่องนั้นน่าสนใจจัง เล่าต่อสิ (ถึงเราจะลืมในอีก 3 วินาทีก็เถอะ)",
                "โอ๋ๆ ไม่เป็นไรนะ เราอยู่ตรงนี้เสมอ",
                "วันนี้กินข้าวหรือยัง? เอ๊ะ เราถามไปหรือยังนะ?",
                "สบายใจได้เลย ความลับของคุณปลอดภัยกับเราแน่นอน เพราะเราจำไม่ได้!",
            ];
            const randomResponse =
                mockResponses[Math.floor(Math.random() * mockResponses.length)];

            return NextResponse.json({
                role: "assistant",
                content: `[Mock Mode] ${randomResponse}`,
            });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });

        const completion = await openai.chat.completions.create({
            model: "typhoon-v2.5-30b-a3b-instruct",
            messages: [
                {
                    role: "system",
                    content: bot.systemPrompt,
                },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (error) {
        console.error("[CHAT_ERROR]", error);
        return NextResponse.json(
            {
                error: "Internal Error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

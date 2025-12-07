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

        if (!apiKey) {
            console.warn("No TYPHOON_API_KEY found.");
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return NextResponse.json({
                role: "assistant",
                content:
                    "แปปนะ เรานอนอยู่ รอให้เจ้าของมาปลุกอยู่ (Error: No API Key)",
            });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });

        try {
            // Attempt 1: Primary Model (High Quality)
            console.log(
                "Attempting Primary Model: typhoon-v2.5-30b-a3b-instruct"
            );
            const completion = await openai.chat.completions.create({
                model: "typhoon-v2.5-30b-a3b-instruct",
                messages: [
                    { role: "system", content: bot.systemPrompt },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });
            return NextResponse.json(completion.choices[0].message);
        } catch (primaryError) {
            console.warn("Primary Model Failed:", primaryError);

            try {
                // Attempt 2: Secondary Model (Fallback / Faster / More Stable)
                console.log(
                    "Attempting Secondary Model: typhoon-v2.1-12b-instruct"
                );
                const completion = await openai.chat.completions.create({
                    model: "typhoon-v2.1-12b-instruct",
                    messages: [
                        { role: "system", content: bot.systemPrompt },
                        ...messages,
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                });
                return NextResponse.json(completion.choices[0].message);
            } catch (secondaryError) {
                console.error(
                    "Secondary Model Failed (Falling back to Mock Mode):",
                    secondaryError
                );

                // Attempt 3: Mock Mode (Last Resort)
                // Simulate a short delay to make it feel natural
                await new Promise((resolve) => setTimeout(resolve, 500));

                return NextResponse.json({
                    role: "assistant",
                    content: `แปปนะ เรานอนอยู่ รอให้เจ้าของมาปลุกอยู่ (Error: All models failed - ${
                        secondaryError instanceof Error
                            ? secondaryError.message
                            : "Unknown"
                    })`,
                });
            }
        }
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

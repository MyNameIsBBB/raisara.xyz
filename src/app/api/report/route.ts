import { NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1449756858108612609/hogiZywjEbKyy4U3kTrRtYFgtx1qD-VE0NMaSbaSW99894CkgNeIGiELtTBVXuVhMvU5";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const message = formData.get("message") as string;
        const file = formData.get("file") as File | null;

        const discordFormData = new FormData();
        // Discord webhook formatting
        discordFormData.append(
            "content",
            `📝 **New Report**\n\n**Details:**\n${message}`
        );

        if (file) {
            discordFormData.append("file", file);
        }

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            body: discordFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Discord Webhook Error:", response.status, errorText);
            return NextResponse.json(
                {
                    error: "Failed to send report to Discord",
                    details: errorText,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error handling report:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

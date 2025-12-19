import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const slip = formData.get("slip") as File;
        const message = formData.get("message") as string;

        if (!slip) {
            return NextResponse.json(
                { error: "กรุณาแนบสลิปการโอนเงิน" },
                { status: 400 }
            );
        }

        const discordWebhookUrl =
            "https://discord.com/api/webhooks/1451404508167929886/EKorYUEGfdTy2PkUOLyWJjKQN6W5RBYmwlavn0H0ULdEH_2lQxFKEOJNcoEZVKk7-P-y";

        const discordFormData = new FormData();
        discordFormData.append(
            "content",
            `**ได้รับยอดสนับสนุนใหม่!**\n\nข้อความจากผู้โอน: ${message || "-"}`
        );
        discordFormData.append("file", slip, slip.name);

        const response = await fetch(discordWebhookUrl, {
            method: "POST",
            body: discordFormData,
        });

        if (!response.ok) {
            console.error("Discord Webhook Error:", await response.text());
            return NextResponse.json(
                { error: "ส่งข้อมูลไปยัง Discord ไม่สำเร็จ" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Support API Error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
            { status: 500 }
        );
    }
}

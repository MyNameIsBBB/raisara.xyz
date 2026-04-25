import Link from "next/link";
import { Coffee, HeartHandshake, NotebookPen, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const blogIdeas = [
    "เรื่องที่กำลังลองทำในเว็บนี้และของที่พังระหว่างทาง",
    "บันทึกการทำ local AI, tools ฝั่ง client, และของเล่นบนเว็บ",
    "ไอเดีย blog ส่วนตัวแบบเล่า process มากกว่าขายความเก่ง",
];

export default function AboutPage() {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-16 space-y-10 min-h-[calc(100vh-3.5rem)]">
            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
                <div className="space-y-5">
                    <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                        About Me
                    </p>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
                        Personal profile, personal blogs, and support in one
                        place.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        หน้านี้แทน Support page เดิม
                        และตั้งใจทำเป็นพื้นที่รวมตัวตนของเจ้าของเว็บ, แนวทางของ
                        personal blog, และ section สำหรับการสนับสนุนก่อนต่อ
                        payment gateway จริงภายหลัง
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/blog">อ่านบล็อก</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/report">แจ้งปัญหาเว็บ</Link>
                        </Button>
                    </div>
                </div>

                <Card className="border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <UserRound className="h-6 w-6" />
                            Profile Snapshot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                        <p>
                            เราออกแบบหน้านี้ให้เป็นโครง frontend
                            ที่คุณจะเอาไปใส่ข้อมูลจริงของตัวเองได้ต่อเลย ทั้ง
                            bio, social links, highlights, และ personal story
                        </p>
                        <p>
                            ตอนนี้เลยวาง layout
                            ให้เน้นว่าเจ้าของเว็บเป็นคนทำของเล่นบนเว็บ, ชอบลอง
                            tech ใหม่, เขียน blog จากของที่สร้างจริง,
                            และเปิดทางให้คนสนับสนุนงานได้ในอนาคต
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
                <Card className="border-2 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <NotebookPen className="h-5 w-5" />
                            Personal Blogs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        {blogIdeas.map((idea) => (
                            <div
                                key={idea}
                                className="rounded-xl border border-border p-3 bg-background/50"
                            >
                                {idea}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-2 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HeartHandshake className="h-5 w-5" />
                            Work Style
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground leading-7">
                        <p>ชอบทำของที่ใช้ได้จริงก่อน แล้วค่อย polish ทีหลัง</p>
                        <p>
                            สนใจเรื่อง local AI, browser tools, personal
                            products และ blog ที่เล่าเบื้องหลังการทำงาน
                        </p>
                        <p>
                            อยากให้หน้า About นี้กลายเป็น profile hub
                            ของเว็บในระยะยาว
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coffee className="h-5 w-5" />
                            Support Section
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground leading-7">
                        <p>
                            ตอนนี้เป็น placeholder frontend ไว้ก่อน
                            คุณสามารถเปลี่ยนส่วนนี้ไปเชื่อม payment gateway
                            จริงทีหลังได้เลย
                        </p>
                        <div className="rounded-2xl border-2 border-dashed border-border p-4 bg-primary/5 text-foreground">
                            Payment gateway placeholder
                        </div>
                        <p>
                            จะแทนด้วย Stripe, Omise, GB Prime Pay
                            หรือระบบจริงของคุณภายหลังก็ได้
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

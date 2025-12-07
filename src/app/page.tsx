import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center space-y-8 bg-background">
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    ยินดีต้อนรับสู่ ไร้สาระ
                </h1>
                <p className="text-xl text-muted-foreground font-mono animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    รวมเครื่องมือและสิ่งของไร้สาระ (แต่มีประโยชน์) ไว้ที่นี่
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
                <Link href="/tools">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto gap-2 text-lg h-14 px-8 border-2 border-black dark:border-white bg-[#22c55e] hover:bg-[#16a34a] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        ดูเครื่องมือทั้งหมด <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
                <Link href="/chatbot">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto gap-2 text-lg h-14 px-8 border-2 border-black dark:border-white bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        ดูแชทบอททั้งหมด <Bot className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 text-center space-y-8 bg-yellow-50">
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-black animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    ยินดีต้อนรับสู่ ไร้สาระ
                </h1>
                <p className="text-xl text-black/80 font-mono animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    รวมเครื่องมือและสิ่งของไร้สาระ (แต่มีประโยชน์) ไว้ที่นี่
                </p>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
                <Link href="/tools">
                    <Button
                        size="lg"
                        className="gap-2 text-lg h-12 px-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        ดูเครื่องมือทั้งหมด <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

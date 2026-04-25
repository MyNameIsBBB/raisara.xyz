import {
    FileAudio,
    ImageIcon,
    QrCode,
    ScanLine,
    type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    canUseWithoutLogin: boolean;
    badgeLabel: string;
}

export const toolDefinitions: ToolDefinition[] = [
    {
        title: "แปลง Link เป็น QR Code",
        description: "สร้าง QR Code จากลิ้งก์เว็บไซต์ได้ง่ายๆ",
        icon: QrCode,
        href: "/tools/qrcode",
        canUseWithoutLogin: true,
        badgeLabel: "ใช้ฟรี",
    },
    {
        title: "แปลงรูปภาพเป็น QR Code",
        description: "ส่งรูปภาพผ่าน QR Code และ WebRTC ได้ฟรี",
        icon: ScanLine,
        href: "/tools/qr-scanner",
        canUseWithoutLogin: true,
        badgeLabel: "ใช้ฟรี",
    },
    {
        title: "ลบพื้นหลังรูปภาพ",
        description: "ลบพื้นหลังรูปภาพด้วย AI ฟรี หลังล็อกอิน",
        icon: ImageIcon,
        href: "/tools/bg-remover",
        canUseWithoutLogin: false,
        badgeLabel: "ต้องล็อกอิน",
    },
    {
        title: "แปลงไฟล์ MP4 เป็น MP3",
        description: "แปลงไฟล์วิดีโอเป็นเสียง ใช้งานง่าย ไม่ต้องติดตั้งโปรแกรม",
        icon: FileAudio,
        href: "/tools/mp4-to-mp3",
        canUseWithoutLogin: false,
        badgeLabel: "ต้องล็อกอิน",
    },
];

export function getToolDefinition(href: string) {
    return toolDefinitions.find((tool) => tool.href === href);
}

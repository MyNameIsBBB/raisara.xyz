import type { Metadata, Viewport } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const chakraPetch = Chakra_Petch({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin", "thai"],
    variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "ไร้สาระ",
    description: "Web application for simple tools and chatbot",
    icons: {
        icon: "/image/raisara.ico",
        shortcut: "/image/raisara.ico",
        apple: "/image/raisara.ico",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    interactiveWidget: "resizes-content",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th" suppressHydrationWarning>
            <body
                className={`${chakraPetch.variable} ${jetbrainsMono.variable} font-mono antialiased min-h-screen bg-background text-foreground`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="flex-1">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}

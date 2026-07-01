import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import HorizontalNavbar from "@/components/HorizontalNavbar";
import VerticalNavbar from "@/components/VerticalNavbar";
import "./globals.css";

const notoKufiArabic = Noto_Kufi_Arabic({
    subsets: ["arabic"],
    variable: "--font-arabic",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Qasim Kamran",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${notoKufiArabic.variable} h-full antialiased`}
        >
            <body className="min-h-full">
                <div
                    className="site-shell flex min-h-screen flex-col md:flex-row"
                    data-site-shell
                >
                    <div className="horizontal-navbar-shell sticky top-0 z-50 border-b border-white/10 md:hidden">
                        <HorizontalNavbar />
                    </div>
                    <aside className="hidden shrink-0 basis-1/4 md:block">
                        <VerticalNavbar />
                    </aside>
                    <main className="flex-1 px-4 md:basis-3/4 md:px-0 md:pl-[5vw]">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}

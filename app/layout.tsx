import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/NavBar";


export const metadata: Metadata = {
    title: "EsportsDash - League of Legends Esports Hub",
    description: "Stay up to date with League of Legends matches, tournaments, and player statistics. Track your favorite teams and never miss a game.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="relative min-h-screen">
                {/* Background pattern */}
                <div className="absolute inset-0">
                    <div className="relative h-full w-full bg-black [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [&>div]:bg-[size:14px_24px]">
                        <div></div>
                    </div>
                </div>
                {/* Content */}
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}

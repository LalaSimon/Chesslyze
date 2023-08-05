import "./globals.css";
import Link from "next/link";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Link href="/">
                    <h1>Welcome on Chesslyze</h1>
                </Link>
                {children}
            </body>
        </html>
    );
}

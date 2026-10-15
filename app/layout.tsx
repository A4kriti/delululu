
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delululu",
  description: "A storytelling platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFDF7] text-[#4A2638] antialiased">
        {children}
      </body>
    </html>
  );
}

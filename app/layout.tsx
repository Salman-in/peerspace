import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerSpace - Campus Community Platform",
  description: "Connect with your campus community, share resources, and build meaningful connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col bg-[#0f0f0f]`}
      >
        <div className="grow">
          {children}
        </div>
        
      </body>
    </html>
    </ClerkProvider>
  );
}

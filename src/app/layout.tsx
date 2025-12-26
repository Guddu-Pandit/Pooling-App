import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";



export const metadata: Metadata = {
  title: "Polling App",
  description: "Polling App created by next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased">
        {children}
          <Toaster />
      </body>
    </html>
  );
}

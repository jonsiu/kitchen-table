import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/lib/convex-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kitchen Table",
  description: "Smart meal planning that brings families together around food. Generate AI-powered recipes, track ingredients, and plan nutritious meals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <ConvexClientProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
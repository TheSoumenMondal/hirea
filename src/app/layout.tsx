import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/navbar";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hirea",
  description: "Find your dream job or hire top talent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-0 left-0 w-full z-50">
            <div className="w-full max-w-3xl mx-auto px-4 pt-4 backdrop-blur-lg">
              <Navbar />
            </div>
          </div>

          <main className="pt-20 w-full flex flex-col items-center">
            <div className="w-full max-w-3xl px-4">{children}</div>
          </main>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

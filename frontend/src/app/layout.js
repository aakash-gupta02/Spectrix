import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { defaultMetadata, defaultViewport } from "@/lib/seo/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = defaultMetadata;
export const viewport = defaultViewport;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased selection:bg-primary selection:text-page`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider />
        <QueryProvider>
          <AuthProvider>
            <ServiceProvider>{children}</ServiceProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

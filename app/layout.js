import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/components/ui/ThemeProvider";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import NetworkStatus from "@/components/offline/OfflineBanner";
import VitalsBackground from "@/components/background/vitals-background";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Medimaa – Your Personal Health Companion",
  description:
    "Manage medications, health records, and share access with family — all in one place.",
  keywords: ["health tracker", "medication reminder", "medical records", "personal health"],
  openGraph: {
    title: "Medimaa",
    description: "Your personal health management platform.",
    url: "https://medimaa.online",
    siteName: "Medimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medimaa – Your Personal Health Companion",
    description: "Manage medications, health records, and family access.",
  },
  metadataBase: new URL("https://medimaa.online"),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        <ThemeProvider>
          

          {/* Background color goes here, not on body */}
          <div className="relative z-10 flex flex-col flex-1 bg-[#f4f4f2] dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90">
            <NetworkStatus />
            <VitalsBackground />
            <NavbarWrapper />
            {children}
            <Footer />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
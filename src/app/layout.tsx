import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Oasis Wellness Consultancy",
    default: "Oasis Wellness Consultancy | Evidence-Based Wellness Solutions",
  },
  description: "Helping health brands, corporates, and schools communicate wellness with credibility, clarity, and impact.",
  keywords: ["Nutrition Consultant", "Wellness Consultant", "Corporate Wellness Training", "School Nutrition Programs", "Health Education", "Nutrition Workshops", "Health Communication Specialist"],
  icons: {
    icon: "/favicon.jpeg",
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

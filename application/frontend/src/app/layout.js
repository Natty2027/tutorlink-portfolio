import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

// Replace with your Google Analytics Measurement ID (format: G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SFSU Tutoring Marketplace - CSC 648 Project",
  description:
    "Find peer tutors for your SFSU courses. A marketplace connecting students with qualified tutors.",
  keywords:
    "SFSU, tutoring, computer science, students, peer tutoring, CSC 648",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}

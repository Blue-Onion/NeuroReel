import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuroflix",
  description:
    "Transform static training materials into dynamic, AI-driven learning experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${archivoBlack.variable} antialiased bg-white text-gray-900`}
      >
        {/* Navbar */}
        <div className="fixed top-4 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Main content */}
        <main className="">{children}</main>

        {/* Footer */}
        <footer className="bg-linear-to-b from-blue-50 to-blue-100 py-10 ">
          <div className="container mx-auto px-6 text-center">
            <h3 className="font-archivoBlack text-2xl font-bold text-blue-700 mb-4">
              NeuroReel
            </h3>

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Neuroflix. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

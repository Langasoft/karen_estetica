import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karen Estética Integral | Bienvenida",
  description:
    "Centro de estética femenino: bienestar, belleza y cuidado integral. Descubre nuestros servicios.",
  metadataBase: new URL("https://karen-estetica.example.com"),
  openGraph: {
    title: "Karen Estética Integral",
    description:
      "Bienvenida a un espacio cálido y femenino para tu cuidado integral.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karen Estética Integral",
    description:
      "Bienvenida a un espacio cálido y femenino para tu cuidado integral.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[--brand-primary]/20`}>
        {children}
      </body>
    </html>
  );
}

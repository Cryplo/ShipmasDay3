import type { Metadata } from "next";
import { Mountains_of_Christmas, Playfair_Display } from "next/font/google";
import "./globals.css";

const mountainsOfChristmas = Mountains_of_Christmas({
  weight: ['400', '700'],
  variable: "--font-christmas",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Light Symphony - Paint Christmas Lights with Sound",
  description: "An interactive Christmas visualization where your voice paints festive lights. Sing, clap, or make noise to light up a snowy house with colors that respond to sound.",
  keywords: ["christmas", "lights", "sound", "interactive", "microphone", "visualization"],
  openGraph: {
    title: "Light Symphony",
    description: "Paint Christmas lights with your voice",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mountainsOfChristmas.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

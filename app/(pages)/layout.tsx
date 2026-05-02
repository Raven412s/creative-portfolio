import type { Metadata, Viewport } from "next";

import Navbar from "@/components/global/navbar";
import SmoothScrolling from "@/components/providers/smooth-scrolling";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CursorProvider } from "@/components/cursor/claude-cursor";
import { geistMono, geistSans, gridular, inter, irishGrover, italiana, jacquard24, kings, kolkerBrush, playfair, poppins, rmMono, rmNeue } from "../fonts/fonts";
import "../globals.css";
import Footer from "@/components/global/footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-ashutosh-sharan.vercel.app/"),

  title: {
    default: "Raven Unleashed — Creative Developer Portfolio",
    template: "%s | Raven Unleashed",
  },

  description:
    "Raven Unleashed is the creative developer portfolio of Ashutosh Sharan, showcasing immersive digital experiences built with Next.js, Three.js, GSAP, and modern web technologies.",

  keywords: [
    "Raven Unleashed",
    "Ashutosh Sharan",
    "Creative Developer",
    "Frontend Developer",
    "Next.js Portfolio",
    "Three.js Developer",
    "GSAP Developer",
    "WebGL Developer",
    "Interactive Portfolio",
    "UI Developer",
    "Creative Portfolio",
  ],

  authors: [
    {
      name: "Ashutosh Sharan",
      url: "https://portfolio-ashutosh-sharan.vercel.app/",
    },
  ],

  creator: "Ashutosh Sharan",
  publisher: "Raven Unleashed",

  applicationName: "Raven Unleashed",

  openGraph: {
    title: "Raven Unleashed — Creative Developer Portfolio",
    description:
      "Portfolio of Ashutosh Sharan (Raven Unleashed), a creative developer building immersive, interactive web experiences.",
    url: "https://portfolio-ashutosh-sharan.vercel.app/",
    siteName: "Raven Unleashed",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Raven Unleashed — Portfolio of Ashutosh Sharan",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/assets/svg/raven.svg",
    shortcut: "/assets/svg/raven.svg",
  },

  category: "technology",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${playfair.variable} ${irishGrover.variable} ${italiana.variable} ${jacquard24.variable} ${kolkerBrush.variable} ${kings.variable} 
         ${gridular.variable} ${rmMono.variable} ${rmNeue.variable}
         antialiased touch-manipulation w-full`}
        suppressHydrationWarning
      >
        <SmoothScrolling>
          <ThemeProvider attribute="class" enableSystem={false}>
            <CursorProvider>
              <Navbar />
              {/* ✅ Yahan z-index aur padding-bottom daalo */}
              <main className="relative z-10 pointer-events-none" style={{ paddingBottom: "100vh" }}>
                {children}
              </main>
              <Footer />
            </CursorProvider>
          </ThemeProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}

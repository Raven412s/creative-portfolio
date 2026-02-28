// app/fonts.ts
import { Inter, Poppins, Playfair_Display, Geist, Geist_Mono, Irish_Grover, Italiana, Jacquard_24, Kolker_Brush, Kings } from "next/font/google";
import  LocalFont  from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const irishGrover = Irish_Grover({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-irish-grover",
  display: "swap",
});

export const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italiana",
  display: "swap",
});

export const kolkerBrush = Kolker_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kolker-brush",
  display: "swap",
});

export const jacquard24 = Jacquard_24({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jacquard24",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const kings = Kings({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kings",
  display: "swap",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const gridular = LocalFont({
  src: "./Gridular-Regular.woff2",
  variable: "--font-gridular",
})

export const rmNeue = LocalFont({
  src: "./RMNeue-Regular.woff2",
  variable: "--font-rm-neue",
})

export const rmMono = LocalFont({
  src: "./RMMono-Regular.woff2",
  variable: "--font-rm-mono",
})
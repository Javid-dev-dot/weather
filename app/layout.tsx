import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import TransitionProvider from "@/components/TransitionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import AtmosphericShader from "@/components/AtmosphericShader";
import CursorFollower from "@/components/CursorFollower";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050f1a" },
    { media: "(prefers-color-scheme: light)", color: "#f0f5fa" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nimbus-weather.vercel.app"),
  title: {
    default: "Nimbus — Atmospheric Intelligence & Weather Forecast",
    template: "%s · Nimbus Weather",
  },
  description:
    "Real-time hyper-local conditions, 5-day outlook, solar trajectory, and extreme weather apparel advisory powered by Open-Meteo.",
  openGraph: {
    title: "Nimbus — Atmospheric Intelligence & Weather Forecast",
    description:
      "Real-time hyper-local conditions, 5-day outlook, solar trajectory, and extreme weather apparel advisory powered by Open-Meteo.",
    type: "website",
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col text-fog overflow-x-hidden selection:bg-sky/30 selection:text-fog">
        <CursorFollower />
        <SmoothScroll>
          <AtmosphericShader />
          <PageLoader />
          <Navbar />
          <TransitionProvider>
            <main className="flex-1">{children}</main>
            <Footer />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}



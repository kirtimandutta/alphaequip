import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { InquiryDrawer } from "@/components/InquiryDrawer";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kirtimandutta.github.io/alphaequip"),
  title: {
    default: "Alpha Equipments | High-Temperature Cremation Furnaces",
    template: "%s · Alpha Equipments",
  },
  description:
    "Advanced high-temperature cremation furnaces and eco-friendly thermal systems from Vadodara. 1400°C refractory, smokeless secondary combustion, and turnkey municipal installation.",
  applicationName: "Alpha Equipments",
  openGraph: {
    title: "Alpha Equipments | High-Temperature Cremation Furnaces",
    description:
      "1400°C refractory cremation furnaces with secondary combustion, wet scrubbing, and turnkey crematorium scope.",
    type: "website",
    images: ["https://kirtimandutta.github.io/alphaequip/images/machine-exterior.png"],
  },
  alternates: {
    canonical: "https://kirtimandutta.github.io/alphaequip/",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${space.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-obsidian font-sans text-zinc-100">
        <Providers>
          {children}
          <InquiryDrawer />
        </Providers>
      </body>
    </html>
  );
}

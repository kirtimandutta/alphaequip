import { Configurator } from "@/components/Configurator";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HotspotInspector } from "@/components/HotspotInspector";
import { Marquee } from "@/components/Marquee";
import { Navbar } from "@/components/Navbar";
import { RoiSimulator } from "@/components/RoiSimulator";
import { Turnkey } from "@/components/Turnkey";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="content">
        <Hero />
        <Marquee />
        <Configurator />
        <HotspotInspector />
        <RoiSimulator />
        <Turnkey />
      </main>
      <Footer />
    </>
  );
}

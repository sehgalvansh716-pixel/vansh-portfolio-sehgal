import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// Custom SVG Dividers
import RibbonDivider from "@/components/ui/dividers/RibbonDivider";
import VisionDivider from "@/components/ui/dividers/VisionDivider";
import AscensionDivider from "@/components/ui/dividers/AscensionDivider";
import ConstellationDivider from "@/components/ui/dividers/ConstellationDivider";
// import CpuScrollAnimation from "@/components/sections/CpuScrollAnimation";

export const metadata: Metadata = {
  title: "Vansh Sehgal — Business Operations & Data Analyst",
  description:
    "Vansh Sehgal is a Business Operations & Data Analyst based in Delhi, India, specializing in SQL, Tableau, AI automation, and data-driven business decisions.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <MarqueeStrip />
        {/* <CpuScrollAnimation /> */}
        <About />
        <RibbonDivider />
        <Skills />
        <VisionDivider />
        <Experience />
        <AscensionDivider />
        <Projects />
        <ConstellationDivider />
        <Testimonials />
        <Certifications />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

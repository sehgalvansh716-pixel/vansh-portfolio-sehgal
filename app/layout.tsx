import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site.config";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/ui/SmoothScroller"), { ssr: false });

// ─── Google Fonts via next/font (zero layout shift) ──────────
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.title}`,
  description:
    "Vansh Sehgal is a Business Operations & Data Analyst based in Delhi, India. Specializing in SQL, Tableau, AI automation, and data-driven decision making. Google-certified, Deloitte-trained.",
  keywords: [
    "Vansh Sehgal",
    "Business Analyst",
    "Data Analyst",
    "Delhi",
    "SQL",
    "Tableau",
    "AI Automation",
    "Business Operations",
    "Google Data Analytics",
    "Portfolio",
  ],
  authors: [{ name: "Vansh Sehgal", url: siteConfig.linkedin }],
  creator: "Vansh Sehgal",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vanshsehgal.vercel.app",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description:
      "Business Operations & Data Analyst. AI-augmented. Google-certified. Deloitte-trained. Based in Delhi, India.",
    siteName: "Vansh Sehgal Portfolio",
    images: [
      {
        url: "/images/avatar.jpg",
        width: 800,
        height: 800,
        alt: "Vansh Sehgal — Business Operations & Data Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: "Business Operations & Data Analyst. AI-augmented. Google-certified. Deloitte-trained.",
    images: ["/images/avatar.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── JSON-LD Structured Data ─────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vansh Sehgal",
  jobTitle: "Business Operations & Data Analyst",
  description:
    "Results-driven BBA professional combining technical proficiency in data analytics and AI automation with strong client relations expertise.",
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Manipal University",
    },
    {
      "@type": "EducationalOrganization",
      name: "Kendriya Vidyalaya",
    },
  ],
  knowsAbout: [
    "SQL",
    "Tableau",
    "Data Analytics",
    "Business Operations",
    "AI Automation",
    "Prompt Engineering",
    "Excel",
    "R Programming",
    "Data Entry",
    "Customer Relations",
  ],
  sameAs: [siteConfig.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    contactType: "Professional Inquiries",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <style>{`
            [style*="opacity: 0"] {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body id="main-content" className="bg-brand-black text-brand-white selection:bg-accent-primary/30 selection:text-brand-white min-h-[100dvh] flex flex-col font-body transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Skip link for keyboard users */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

        {/* Client-only: custom cursor + smooth scroller */}
        <CustomCursor />
        <SmoothScroller />

        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

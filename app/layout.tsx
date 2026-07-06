import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site.config";
import { ThemeProvider } from "@/components/ThemeProvider";
import ColorThemeProvider from "@/components/ColorThemeProvider";
import { ClientOnlyWrappers } from "@/components/ClientOnlyWrappers";

// ─── Google Fonts via next/font (zero layout shift) ──────────
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://vanshsehgal.vercel.app"),
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
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Vansh Sehgal — Business Operations & Data Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: "Business Operations & Data Analyst. AI-augmented. Google-certified. Deloitte-trained.",
    images: ["/images/og-preview.png"],
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
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
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
      <body suppressHydrationWarning id="main-content" className="bg-brand-black text-brand-white selection:bg-accent-primary/30 selection:text-brand-white min-h-[100dvh] flex flex-col font-body transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ColorThemeProvider>
            {/* Skip link for keyboard users */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            {/* Client-only: custom cursor + smooth scroller */}
            <ClientOnlyWrappers />

            {children}
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { SiteIntro } from "@/components/site-intro";
import { AnimatedBackground } from "@/components/animated-background";
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist/latin-700.css";
import "@fontsource/geist-mono/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Aleph Rafael — Cloud & Infraestrutura",
  description: "Portfólio de Aleph Rafael, em busca da primeira oportunidade em cloud e infraestrutura. Conheça meu primeiro projeto e meus interesses de estudo.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Aleph Rafael — Cloud & Infraestrutura",
    description: "Meu primeiro passo em cloud e infraestrutura. Conheça meu projeto e meus próximos estudos.",
    type: "website",
    locale: "pt_BR",
    siteName: "Portfólio de Aleph Rafael",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><SiteIntro><AnimatedBackground />{children}</SiteIntro></body></html>;
}

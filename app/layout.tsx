import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/animated-background";
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist/latin-700.css";
import "@fontsource/geist-mono/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Aleph Rafael — Cloud & Cibersegurança",
  description: "Conheça Aleph Rafael: interesses em AWS Cloud, cibersegurança, Python e desenvolvimento web. Em busca da primeira oportunidade em tecnologia.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Aleph Rafael — Cloud & Cibersegurança",
    description: "Cloud, código e novas possibilidades. Conheça meu portfólio e minhas áreas de interesse.",
    type: "website",
    locale: "pt_BR",
    siteName: "Portfólio de Aleph Rafael",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><AnimatedBackground />{children}</body></html>;
}

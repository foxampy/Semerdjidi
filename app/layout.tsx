import type { Metadata, Viewport } from 'next';
import { site } from '@/lib/site';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SiteFooter } from '@/components/shell/SiteFooter';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

/**
 * Шрифты — реальные файлы брендбука (Orchidea Pro / Raleway / Tenor Sans),
 * self-hosted через next/font/local (см. lib/fonts.ts), а не Google Fonts:
 * ни один из трёх не является Google-шрифтом (Orchidea Pro — точно
 * коммерческий), а кириллица в локальных файлах проверена через fontTools
 * (cmap) — все три семейства содержат полный диапазон U+0400–U+045F.
 */
const TITLE = `${site.name} — ${site.subtitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
    template: `%s — ${site.short}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: site.description,
  },
  icons: {
    icon: [{ url: '/brand/logo-symbol.png', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#1c120e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

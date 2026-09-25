import type { Metadata, Viewport } from 'next';
import { site } from '@/lib/site';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SiteFooter } from '@/components/shell/SiteFooter';
import './globals.css';

/**
 * Newsreader/Space Mono грузятся напрямую через Google Fonts CSS2 API, а не
 * через next/font/google: у next/font для Newsreader в этой версии Next нет
 * подмножества `cyrillic` (только latin/latin-ext/vietnamese), а сайт на
 * русском. Прямой <link> — тот же способ, что и в уже одобренном и
 * задеплоенном HTML-макете (2.html): Google сам отдаёт нужные unicode-range
 * блоки, включая кириллицу, без явного параметра subset.
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
  themeColor: '#191305',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

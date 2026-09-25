import Link from 'next/link';
import Image from 'next/image';
import { nav, site } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-lowest)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo-symbol.png"
            alt="Семерджиди"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
              {site.name}
            </span>
            <span className="label-caps text-[10px] text-[color:var(--color-outline)]">
              {site.subtitle}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps text-[11px] text-[color:var(--color-on-surface-variant)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.contacts.telegramUrl}
            className="label-caps hidden text-[11px] text-[color:var(--color-outline)] hover:text-[color:var(--color-primary)] sm:inline"
          >
            {site.contacts.telegram}
          </a>
          <Link href="/booking" className="btn-primary px-4 py-2 text-xs label-caps">
            Записаться
          </Link>
        </div>
      </div>
    </header>
  );
}

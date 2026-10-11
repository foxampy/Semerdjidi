import Link from 'next/link';
import { footerLinks, nav, site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--color-surface-container-lowest)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
            {site.name}
          </div>
          <p className="max-w-xs text-sm text-[color:var(--color-on-surface-variant)]">
            {site.tagline}
          </p>
        </div>

        <div className="space-y-3">
          <div className="label-caps text-[11px] text-[color:var(--color-outline)]">Навигация</div>
          <ul className="space-y-2 text-sm text-[color:var(--color-on-surface-variant)]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[color:var(--color-primary)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="label-caps text-[11px] text-[color:var(--color-outline)]">Центр</div>
          <ul className="space-y-2 text-sm text-[color:var(--color-on-surface-variant)]">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[color:var(--color-primary)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="label-caps text-[11px] text-[color:var(--color-outline)]">Контакты</div>
          <ul className="space-y-2 text-sm text-[color:var(--color-on-surface-variant)]">
            <li>{site.contacts.address}</li>
            <li>
              <a href={site.contacts.phoneHref} className="hover:text-[color:var(--color-primary)]">
                {site.contacts.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contacts.email}`} className="hover:text-[color:var(--color-primary)]">
                {site.contacts.email}
              </a>
            </li>
            <li>{site.contacts.workingHours}</li>
          </ul>
        </div>
      </div>

      <div className="hairline mx-5 md:mx-10" />

      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-xs text-[color:var(--color-outline)] sm:flex-row sm:items-center sm:justify-between md:px-10">
        <span>© {new Date().getFullYear()} {site.name}. Все права защищены.</span>
        <span className="label-caps">Ташкент · Узбекистан</span>
      </div>
    </footer>
  );
}

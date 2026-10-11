import localFont from 'next/font/local';

/**
 * Реальные шрифты брендбука центра (не Google Fonts) — файлы взяты из
 * F:\EvenEsh\Психологический центр Семерджиди\брендбук\Typography и лежат в
 * app/fonts. Кириллица проверена через fontTools (cmap): все три семейства
 * содержат полный диапазон U+0400–U+045F, поэтому self-host через
 * next/font/local безопасен — в отличие от Google Fonts CDN, где кириллица
 * для этих шрифтов не гарантирована.
 *
 * Роли (см. globals.css, --font-display/body/label):
 * - Orchidea Pro — display/заголовки (заменяет Newsreader).
 * - Raleway — основной текст/UI (заменяет Newsreader в body-ролях).
 * - Tenor Sans — лейблы/акценты, uppercase-трекинг (заменяет Space Mono).
 */

export const orchideaPro = localFont({
  src: [
    { path: '../app/fonts/orchidea-pro/OrchideaPro-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/orchidea-pro/OrchideaPro-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/orchidea-pro/OrchideaPro-Medium.otf', weight: '500', style: 'normal' },
    { path: '../app/fonts/orchidea-pro/OrchideaPro-SemiBold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-orchidea',
  display: 'swap',
});

export const raleway = localFont({
  src: [
    { path: '../app/fonts/raleway/Raleway-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../app/fonts/raleway/Raleway-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../app/fonts/raleway/Raleway-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../app/fonts/raleway/Raleway-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-raleway',
  display: 'swap',
});

export const tenorSans = localFont({
  src: [{ path: '../app/fonts/tenor-sans/TenorSans-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--font-tenor',
  display: 'swap',
});

export const fontVariables = `${orchideaPro.variable} ${raleway.variable} ${tenorSans.variable}`;

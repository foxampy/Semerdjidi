/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Тот же аргумент, что и в EvenEsh: статическая сборка на всех ядрах
  // одновременно съедает память до первой отрисованной страницы на машинах
  // с ограниченным RAM. Страниц пока немного, последовательная сборка стоит
  // секунд, а не памяти.
  experimental: { cpus: 1, workerThreads: false },
};

export default nextConfig;

// BASE_PATH بيتحدد تلقائياً من الـ workflow (اسم الريبو). محلياً بيبقى فاضي.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',            // بيطلّع فولدر out/ فيه موقع ثابت
  trailingSlash: true,         // /tasks/ -> tasks/index.html (مناسب لـ GitHub Pages)
  images: { unoptimized: true },
  basePath: base,
};

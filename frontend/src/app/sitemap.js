import { siteConfig } from "@/lib/seo/metadata";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}

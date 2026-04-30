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
    {
      url: `${siteConfig.url}/api-monitoring-tool`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];
}

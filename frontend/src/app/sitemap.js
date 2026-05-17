import { siteConfig } from "@/lib/seo/metadata";

export default function sitemap() {
  const now = new Date();

  return [
    // Main pages
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/api-monitoring-tool`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Documentation pages
    {
      url: `${siteConfig.url}/docs/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/docs/endpoints`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/docs/alert-channels`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/docs/realtime-streaming`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/docs/dashboard`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Static files
    {
      url: `${siteConfig.url}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];
}
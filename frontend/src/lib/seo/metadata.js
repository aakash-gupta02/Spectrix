const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION;

export const siteConfig = {
  name: "Spectrix",
  title: "Spectrix | API Monitoring Platform",
  description:
    "Spectrix helps teams monitor API uptime, latency, failures, and incidents with a single operational dashboard.",
  url: "https://spectrix.d3labs.tech",
  locale: "en_US",
  type: "website",
  ogImage: "/meta/og-image.png",
  twitterImage: "/meta/og-image.png",
  keywords: [
    "spectrix",
    "api monitoring",
    "uptime monitoring",
    "incident management",
    "api observability",
    "latency tracking",
    "error tracking",
    "service health",
    "reliability engineering",
  ],
  author: {
    name: "Aakash Gupta",
    twitter: "@AakashG99795",
  },
};

const absoluteUrl = (path = "/") => {
  if (!path || path === "/") {
    return siteConfig.url;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
};

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Spectrix",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: siteConfig.keywords,
  category: "technology",
  classification: "SaaS, Monitoring, DevOps",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon/favicon.ico" },
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/icon/favicon.ico" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: siteConfig.type,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 633,
        alt: "Spectrix API Monitoring Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.author.twitter,
    images: [siteConfig.twitterImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
  },
  other: {
    "msapplication-TileColor": "#0b1220",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": siteConfig.name,
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

export const defaultViewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d9ff27" },
    { media: "(prefers-color-scheme: dark)", color: "#9bc000" },
  ],
  colorScheme: "light dark",
};

export const createPageMetadata = ({
  title,
  description,
  path = "/",
  keywords = [],
  ogImage,
  twitterImage,
  index = true,
  follow = true,
}) => {
  const canonical = absoluteUrl(path);
  const resolvedOgImage = ogImage || siteConfig.ogImage;
  const resolvedTwitterImage = twitterImage || siteConfig.twitterImage;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : siteConfig.keywords,
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
      },
    },
    openGraph: {
      type: siteConfig.type,
      locale: siteConfig.locale,
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 633,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.author.twitter,
      images: [resolvedTwitterImage],
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
      },
    },
  };
};

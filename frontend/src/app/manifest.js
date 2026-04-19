export default function manifest() {
  return {
    name: "Spectrix API Monitoring Platform",
    short_name: "Spectrix",
    description:
      "Monitor API uptime, response times, incidents, and service health from a single dashboard.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#d9ff27",
    orientation: "portrait",
    categories: ["business", "developer", "productivity", "utilities"],
    lang: "en-US",
    icons: [
      {
        src: "/icon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  };
}

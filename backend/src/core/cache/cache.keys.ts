export const CacheKeys = {
  // statusPage
  statusPage: {
    page: (slug: string) => `statusPage:${slug}`,
    views: (slug: string) => `statusPageViews:${slug}`,
    visitor: (slug: string, sessionId: string) =>
      `statusPageVisitor:${slug}:${sessionId}`,
  },
};

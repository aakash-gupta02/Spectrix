const STATUS_PAGE = "statusPage";

export const CacheKeys = {
  statusPage: {
    page: (slug: string) => `${STATUS_PAGE}:${slug}`,
    views: (slug: string) => `${STATUS_PAGE}:${slug}:views`,
    visitor: (slug: string, visitorId: string) =>
      `${STATUS_PAGE}:${slug}:visitor:${visitorId}`,
    active: `${STATUS_PAGE}:active`,
  },
};

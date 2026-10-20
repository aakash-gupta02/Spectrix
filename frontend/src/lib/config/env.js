export default env = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1",

  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV || "development",
};

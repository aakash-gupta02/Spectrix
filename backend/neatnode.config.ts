export default {
  template: "rest-api",

  language: "typescript",
  architecture: "modular",

  database: {
    provider: "mongodb",
    client: "mongoose"
  },
  features: {
    resourceGenerator: true,
  },
  
  validation: "zod",
  srcDir: "src",
};

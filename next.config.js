const withOffline = require("next-offline");

const nextConfig = {
  target: "serverless"
};

module.exports = withOffline(nextConfig);

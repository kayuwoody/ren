// next.config.js
const path = require('path');
module.exports = {
  // Don’t try to fetch SWC binaries
  swcMinify: false,
  // Force Next to use the Babel loader instead of SWC
  experimental: {
    swcLoader: false,
  },
};

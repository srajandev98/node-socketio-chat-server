const defaultConfig = require('./default.config');
const stagingConfig = require('./staging.config');
const productionConfig = require('./production.config');

let config = defaultConfig;

switch (process.env.NODE_ENV) {
    case 'development':
        config = defaultConfig;
        break;
    case 'staging':
        config = stagingConfig;
        break;
    case 'production':
        config = productionConfig;
        break;
  default:
    config = defaultConfig;
}

module.exports = config;

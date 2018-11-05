const winston = require('winston');
const format = winston.format;
const cloudflareID = require('../../middlewares/cloudflareID');

// Options for development
const developmentFormat = format.printf(info => {
  return `${info.timestamp} - ${info.level}: ${info.message}`;
});

let options = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    developmentFormat
  ),
  level: 'info'
};

// Options for production
if (process.env.NODE_ENV === 'production' || process.env.PRODUCTION_LOGGING === 'true') {
  const productionFormat = format.printf(info => {
    let json = {
      cloudflareID: cloudflareID.getCloudflareID(),
      timestamp: new Date(),
      level: info.level,
      message: info.message
    };

    return JSON.stringify(json);
  });

  options.format = format.combine(productionFormat);
}

module.exports = function () {
	return new (winston.transports.Console)(options);
};

// Exported for testing
// module.exports.customFormat = customFormat;

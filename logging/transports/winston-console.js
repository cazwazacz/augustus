const winston = require('winston');
const format = winston.format;
const cloudflareID = require('../../middlewares/cloudflareID');

function customFormat(options) {
  let json = {
    cloudflareID: cloudflareID.getCloudflareID(),
    timestamp: new Date(),
    level: options.level,
    message: options.message
  };

  return JSON.stringify(json);
}

const developmentFormat = format.printf(info => {
  return `${info.timestamp} - ${info.level}: ${info.message}`;
});

const productionFormat = format.printf(info => {
  // return `${info.timestamp} - ${info.level}: ${info.message}`;
  // return JSON.stringify({ level: info.level });
  let json = {
    cloudflareID: cloudflareID.getCloudflareID(),
    timestamp: new Date(),
    level: info.level,
    message: info.message
  };

  return JSON.stringify(json);
  // return customFormat(info);
});

// Options for development
let options = {
  format: format.combine(
    // format.colorize(),
    // format.timestamp(),
    productionFormat
  ),
  level: 'info'
};

// let options = {
//   colorize: true,
//   timestamp: true,
//   level: 'info'
// };

// Options for production
if (process.env.NODE_ENV === 'production' || process.env.PRODUCTION_LOGGING === 'true') {
  // options = {
  //   level: 'info',
  //   formatter: customFormat
  // };
}

// 'use strict';
// var winston = require('winston');

// const { combine, timestamp, printf, colorize } = format;


module.exports = function () {
	// return new (winston.transports.Console)({
	// 	colorize: true,
	// 	timestamp: true,
	// 	level: config.argv.logging
	// });
	return new (winston.transports.Console)(options);
};


// module.exports = function () {
//   return new (winston.transports.Console)(options);
// };

// Exported for testing
module.exports.customFormat = customFormat;

const winston = require('winston');
const Transport = require('winston-transport');
const tls = require('tls');
require('dotenv').config({ path: '../.env' }); 

// Papertrail credentials from environment variables
const paperTrailURL = process.env.paperTrailLogs_URL;
const paperTrailPORT = process.env.paperTrailLogs_PORT;

console.log(paperTrailURL);

class PapertrailTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.host = opts.host;
    this.port = opts.port;
    this.client = null;
  }

  log(info, callback) {
    if (!this.client) {
      this.client = tls.connect(this.port, this.host, () => {
        console.log('Connected to Papertrail');
      });

      this.client.on('error', (err) => {
        console.error('Papertrail connection error:', err);
      });

      this.client.on('end', () => {
        console.log('Disconnected from Papertrail');
        this.client = null;
      });
    }

    const message = `[${info.timestamp}] [${info.level.toUpperCase()}] [Route: ${info.route}] ${info.message}\n`;

    this.client.write(message, () => {
      this.emit('logged', info);
    });

    callback();
  }
}

// Create the logger
const logger = winston.createLogger({
  level: 'debug', // Set to 'debug' to capture all log levels including 'info' and 'error'
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, route }) => {
      return `[${timestamp}] [${level.toUpperCase()}] [Route: ${route}] ${message}`;
    })
  ),
  transports: [
    new PapertrailTransport({
      host: paperTrailURL, // Your Papertrail host
      port: paperTrailPORT, // Your Papertrail port,
      program: 'BitsofMeBackend'
    }),
  ],
});

// Unified logging function for both 'info' and 'error' logs
function createLogs({ route, LogMessage, originalUrl, username, ip, logLevel = 'info' }) {
  const logData = {
    route: route || 'Unknown Route',
    originalUrl: originalUrl || 'N/A',
    username: username || 'Unknown User',
    ip: ip || 'Unknown IP',
  };

  const message = `Original URL: ${logData.originalUrl} | Username: ${logData.username} | IP: ${logData.ip} | Message: ${LogMessage}`;

  if (logLevel === 'error') {
    logger.error(message, { route: logData.route });  // Log 'error' level with route info
  } else {
    logger.info(message, { route: logData.route });  // Log 'info' level with route info
  }
}

module.exports = createLogs;

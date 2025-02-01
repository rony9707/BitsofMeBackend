// const winston = require('winston');
// require('winston-mongodb');

// DBConnectionString = process.env.DBConnectionString;

// if (!DBConnectionString) {
//   process.exit(1);
// }

// // Define the logger
// const logger = winston.createLogger({
//   level: 'debug', // Set to 'debug' to capture all log levels including 'info' and 'error'
//   transports: [
//     new winston.transports.Console({
//       level: 'error', // Only log 'error' level logs to the console
//       format: winston.format.simple(),
//     }),
//     new winston.transports.MongoDB({
//       level: 'debug', // Log 'debug' and above (which includes 'info' and 'error') to MongoDB
//       db: DBConnectionString,
//       collection: 'application_logs',
//       options: { useUnifiedTopology: true },
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json() // Store logs in JSON format
//       ),
//     }),
//   ],
// });

// // Unified logging function for both 'info' and 'error' logs
// function createLogs({ route, LogMessage, originalUrl, username, ip, logLevel = 'info' }) {
//   const logData = {
//     route: route,
//     originalUrl: originalUrl,
//     username: username,
//     ip: ip,
//   };

//   if (logLevel === 'error') {
//     logger.error(LogMessage, logData);  // Log 'error' level
//   } else {
//     logger.info(LogMessage, logData);  // Log 'info' level
//   }
// }

// module.exports = createLogs;

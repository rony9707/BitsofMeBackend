const fs = require('fs');
const path = require('path');
const getCurrentDateTime = require('./getCurrentDateTime');

function getFileNameDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function getRoute(route) {
  switch (route) {
    case 'register':
      return "register";
    case 'login':
      return "login";
    case 'getuser':
      return "getuser";
    case 'logout':
      return "logout";
    case 'createPosts':
      return "createPosts";
    default:
      return "invalidRoute";
  }
}

function createLogs({ route, LogMessage, originalUrl, username, ip }) {
  // Determine the folder for the log based on the route
  const logSavePath = path.join(__dirname, `./../logs/${getRoute(route)}`);

  // Ensure that the folder exists, create it if not
  if (!fs.existsSync(logSavePath)) {
    fs.mkdirSync(logSavePath, { recursive: true });
  }

  // Create the title and file name for the log
  const title = `${getRoute(route)}_log_${getFileNameDate()}`;
  const fileName = `log_${getFileNameDate()}`;

  // Get current date and time for the log entry
  const getCurrentDate = getCurrentDateTime();

  // Log entry to replace with HTML template
  const logEntry = `
    <tr>
      <td>${getCurrentDate}</td>
      <td>${ip}</td>
      <td>${originalUrl}</td>
      <td>${username}</td>
      <td>${LogMessage}</td>
    </tr>
  `;

  // File path for saving the log
  const filePath = path.join(logSavePath, `${fileName}.html`);

  // Path of the HTML log template
  const templatePath = path.join(__dirname, '../mailTemplates/createLogs.html');

  // Check if the log file for the route and date already exists
  if (!fs.existsSync(filePath)) {
    // If the file doesn't exist, create it using the template
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const newContent = templateContent
      .replace(/{{FILE_NAME}}/g, title)
      .replace('{{LOG_ENTRIES}}', logEntry);
    fs.writeFileSync(filePath, newContent, 'utf8');
  } else {
    // If the file exists, append the new log entry
    const existingContent = fs.readFileSync(filePath, 'utf8');
    const updatedContent = existingContent.replace('</tbody>', `${logEntry}</tbody>`);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
}

module.exports = createLogs;

const path = require("path");

// Array of month names
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Function to generate the folder path and zip file name
const generateBackupFolderPath = (databaseName) => {
  const timestamp = new Date().toISOString().replace(/:/g, "-"); // Create a timestamp for the backup
  const backupFolderPath = `./backups/${databaseName}_${timestamp}`; // Path for the backup folder
  const zipFolderPath = `./zips/${databaseName}`; // Path for the zip folder
  const zipFileName = `${databaseName}_${timestamp}.zip`; // Zip file name with database name and timestamp
  const zipFilePath = `${zipFolderPath}/${zipFileName}`; // Full path for the zip file

  return { backupFolderPath, zipFilePath, zipFolderPath, zipFileName };
};

module.exports = generateBackupFolderPath;

const { exec } = require("child_process");

// Function to run the backup command
const runBackupCommand = (backupFolder, mongoUri, callback) => {
  const backupCommand = `mongodump --uri="${mongoUri}" --out="${backupFolder}"`;
  console.log(`Running backup command: ${backupCommand}`);
  exec(backupCommand, callback);
};

module.exports = runBackupCommand;

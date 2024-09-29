const fs = require("fs");
const { zip } = require("zip-a-folder");
const {
  generateBackupFolderPath,
  runBackupCommand,
  deleteFolderRecursive,
  googleDriveUpload,
} = require("../utils");

// Express handler to manage local backup requests
exports.handleBackupRequestLocalStorage = async (req, res) => {
  const DB_NAME = process.env.DB_NAME;
  const DB_USERNAME = process.env.DB_USERNAME;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_HOST = process.env.DB_HOST;

  if (!DB_NAME) {
    console.error("Database name is missing from the request query.");
    return res.status(400).send("Database name is required.");
  }

  const { backupFolderPath, zipFilePath, zipFolderPath, zipFileName } =
    generateBackupFolderPath(DB_NAME);

  console.log("Backup Folder Path:", backupFolderPath);
  console.log("Zip File Path:", zipFilePath);
  console.log("Zip File Name:", zipFileName);

  const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

  // Create backup folder in temp directory
  try {
    fs.mkdirSync(backupFolderPath, { recursive: true });
    console.log(`Successfully created temp folder: ${backupFolderPath}`);
  } catch (mkdirErr) {
    console.error("Error creating directory:", mkdirErr);
    return res
      .status(500)
      .send(`Error creating directory: ${mkdirErr.message}`);
  }

  // Run the backup command
  runBackupCommand(backupFolderPath, MONGO_URI, async (err, stdout, stderr) => {
    if (err) {
      console.error("Backup command failed:", stderr);
      return res
        .status(500)
        .send("Backup command failed. Please try again later.");
    }

    console.log("Backup successful:", stdout);

    // Create zip folder if it doesn't exist
    try {
      fs.mkdirSync(zipFolderPath, { recursive: true });
      console.log(`Successfully created backup zip folder: ${zipFolderPath}`);
    } catch (zipFolderErr) {
      console.error("Error creating zip directory:", zipFolderErr);
      return res
        .status(500)
        .send(`Error creating zip directory: ${zipFolderErr.message}`);
    }

    try {
      // Zip the backup folder
      await zip(backupFolderPath, zipFilePath);
      console.log("Backup folder successfully compressed into:", zipFilePath);

      // Send the zip file to the client
      res.download(zipFilePath, zipFileName, (downloadErr) => {
        if (downloadErr) {
          console.error("Error sending zip file:", downloadErr);
          return res.status(500).send("Error sending zip file.");
        }

        // After successful download, delete the original folder
        try {
          deleteFolderRecursive(backupFolderPath); // Delete the original temp backup folder after zipping
          console.log(
            "Original backup folder successfully deleted:",
            backupFolderPath
          );
        } catch (deleteErr) {
          console.error("Error deleting original backup folder:", deleteErr);
        }
      });
    } catch (zipErr) {
      console.error("Error zipping backup folder:", zipErr);
      return res.status(500).send("Error zipping backup folder.");
    }
  });
};

// Express handler to manage Google Drive backup requests
exports.handleBackupRequestGoogleDrive = async (req, res) => {
  const DB_NAME = process.env.DB_NAME;
  const DB_USERNAME = process.env.DB_USERNAME;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_HOST = process.env.DB_HOST;

  if (!DB_NAME) {
    console.error("Database name is missing from the request query.");
    return res.status(400).send("Database name is required.");
  }

  const { backupFolderPath, zipFilePath, zipFolderPath, zipFileName } =
    generateBackupFolderPath(DB_NAME);

  console.log("Backup Folder Path:", backupFolderPath);
  console.log("Zip File Path:", zipFilePath);
  console.log("Zip File Name:", zipFileName);

  const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

  // Create backup folder in temp directory
  try {
    fs.mkdirSync(backupFolderPath, { recursive: true });
    console.log(`Successfully created temp folder: ${backupFolderPath}`);
  } catch (mkdirErr) {
    console.error("Error creating directory:", mkdirErr);
    return res
      .status(500)
      .send(`Error creating directory: ${mkdirErr.message}`);
  }

  // Run the backup command
  runBackupCommand(backupFolderPath, MONGO_URI, async (err, stdout, stderr) => {
    if (err) {
      console.error("Backup command failed:", stderr);
      return res
        .status(500)
        .send("Backup command failed. Please try again later.");
    }

    console.log("Backup successful:", stdout);

    // Create zip folder if it doesn't exist
    try {
      fs.mkdirSync(zipFolderPath, { recursive: true });
      console.log(`Successfully created backup zip folder: ${zipFolderPath}`);
    } catch (zipFolderErr) {
      console.error("Error creating zip directory:", zipFolderErr);
      return res
        .status(500)
        .send(`Error creating zip directory: ${zipFolderErr.message}`);
    }

    try {
      // Zip the backup folder
      await zip(backupFolderPath, zipFilePath);
      console.log("Backup folder successfully compressed into:", zipFilePath);

      // Send the zip file to Google Drive
      await googleDriveUpload(zipFilePath); // Ensure you pass the correct path for upload
      console.log("Backup uploaded to Google Drive successfully.");

      // Delete the original backup folder and local zip file
      try {
        deleteFolderRecursive(backupFolderPath); // Delete the original temp backup folder
        console.log(
          "Original backup folder successfully deleted:",
          backupFolderPath
        );

        fs.unlinkSync(zipFilePath); // Delete the local zip file
        console.log("Local zip file successfully deleted:", zipFilePath);
      } catch (deleteErr) {
        console.error(
          "Error deleting original backup folder or zip file:",
          deleteErr
        );
      }

      // Send a success response
      return res
        .status(200)
        .send(
          "Backup uploaded to Google Drive and files deleted successfully."
        );
    } catch (zipErr) {
      console.error("Error zipping backup folder:", zipErr);
      return res.status(500).send("Error zipping backup folder.");
    }
  });
};

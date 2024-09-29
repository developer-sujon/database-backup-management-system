exports.handleBackupRequestLocalStorage = (req, res) => {
  const databaseName = req.query.databaseName || "cv"; // Get database name from query parameters or use default
  const { folderPath, zipFileName } = generateBackupFolderPath(databaseName);

  // Debugging: Log the generated path and zip file name
  console.log(`Requested backup for database: ${databaseName}`);
  console.log(`Generated folder path: ${folderPath}`);
  console.log(`Generated zip file name: ${zipFileName}`);

  // MongoDB connection components
  const DB_USERNAME = process.env.DB_USERNAME || "developer-sujon";
  const DB_PASSWORD = process.env.DB_PASSWORD || "Muhammad7047";
  const DB_HOST = process.env.DB_HOST || "cluster0.mtzsh.mongodb.net";
  const DB_NAME = databaseName; // Use the dynamic database name

  // MongoDB Atlas connection URI (using `mongodb+srv://`)
  const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

  // Ensure that the folder path exists
  try {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Successfully created folder: ${folderPath}`);
  } catch (mkdirErr) {
    console.error("Error creating directory:", mkdirErr);
    return res
      .status(500)
      .send(`Error creating directory. ${mkdirErr.message}`);
  }

  runBackupCommand(folderPath, MONGO_URI, (err, stdout, stderr) => {
    if (err) {
      console.error("Backup failed:", stderr);
      return res.status(500).send("Backup failed. Please try again later.");
    }

    console.log("Backup successful:", stdout);

    const zipFilePath = `${folderPath}.zip`;

    createZipArchive(folderPath, zipFilePath, (zipErr) => {
      if (zipErr) {
        console.error("Error during zipping:", zipErr);
        return res.status(500).send("Failed to zip backup.");
      }

      // Send the zip file for download
      res.download(zipFilePath, zipFileName, (downloadErr) => {
        if (downloadErr) {
          console.error("Error during download:", downloadErr);
        }

        // Cleanup: remove the zip file after download
        fs.unlink(zipFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error removing zip file:", unlinkErr);
          }
        });
      });
    });
  });
};

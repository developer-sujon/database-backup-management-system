const express = require("express");
const cors = require("cors"); // Optional, for CORS support
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const { backupController } = require("./controllers");

const app = express();
const PORT = process.env.PORT || 5000;

// Optional: Enable CORS if needed
app.use(cors());

// Middleware for parsing JSON bodies (if needed)
app.use(express.json());

// Define the route to trigger backup and download
app.get("/backup/local", backupController.handleBackupRequestLocalStorage);
app.get(
  "/backup/google-drive",
  backupController.handleBackupRequestGoogleDrive
);

// Global error-handling middleware
app.use((err, _req, res, __next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

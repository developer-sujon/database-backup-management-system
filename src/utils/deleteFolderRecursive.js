const fs = require("fs");
const path = require("path");

// Utility to delete a folder and its contents
const deleteFolderRecursive = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath); // Recursively delete directories
      } else {
        fs.unlinkSync(curPath); // Delete file
      }
    });
    fs.rmdirSync(folderPath); // Remove the folder itself
  }
};

module.exports = deleteFolderRecursive;

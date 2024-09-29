const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Path to your service account credentials JSON file
const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

// The ID of the parent folder where files will be uploaded
const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID;

// Authorize the Google API client with service account credentials
async function authorize() {
  const { client_email, private_key } = credentials;
  if (!client_email || !private_key) {
    throw new Error("Invalid credentials");
  }

  const auth = new google.auth.JWT(client_email, null, private_key, [
    "https://www.googleapis.com/auth/drive.file",
  ]);

  try {
    await auth.authorize();
  } catch (err) {
    throw new Error("Authorization failed: " + err.message);
  }

  return auth;
}

// Use the provided folder ID instead of creating a new one
async function getFolderId() {
  if (PARENT_FOLDER_ID) {
    console.log(`Using existing folder with ID: ${PARENT_FOLDER_ID}`);
    return PARENT_FOLDER_ID;
  } else {
    // Logic to create a new folder (if you want to keep this option)
    const auth = await authorize();
    return await createFolder(auth, ROOT_FOLDER_NAME);
  }
}

// Upload the zip file to Google Drive
async function uploadFile(auth, folderId, zipFilePath) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: path.basename(zipFilePath), // Name of the file
    parents: [folderId], // Upload to the specified folder
  };

  const media = {
    mimeType: "application/zip",
    body: fs.createReadStream(zipFilePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id", // Return the file ID
    });
    console.log("File Id:", file.data.id);
    return file.data.id;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Share the file with 'anyone' (makes it public via a link)
async function shareFile(auth, fileId) {
  const drive = google.drive({ version: "v3", auth });

  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader", // Can be 'reader' or 'writer'
        type: "anyone", // Share with 'anyone' (can also be 'user', 'group', etc.)
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    console.log("File shared. View link:", result.data.webViewLink);
    console.log("Download link:", result.data.webContentLink);
    return result.data;
  } catch (error) {
    console.error("Error sharing file:", error);
    throw error;
  }
}

// Main function to upload zip file to Google Drive
async function googleDriveUpload(zipFilePath) {
  try {
    // Authorize with Google Drive
    const auth = await authorize();

    // Get the folder ID where files will be uploaded
    const folderId = await getFolderId();

    // Upload the zip file and get the file ID
    const fileId = await uploadFile(auth, folderId, zipFilePath);

    // Share the file and get the link
    const sharedFileData = await shareFile(auth, fileId);

    // Log the view/download links
    console.log("Shared File Link:", sharedFileData.webViewLink);
    console.log("Direct Download Link:", sharedFileData.webContentLink);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = googleDriveUpload;

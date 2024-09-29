# Database Backup Management System

A Node.js application for managing backups of MongoDB databases, allowing users to create local backups and upload them to Google Drive. This project provides API endpoints to handle backup requests, compress backup folders into ZIP files, and store them either locally or upload them to Google Drive.

## Table of Contents

- [Database Backup Management System](#database-backup-management-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Environment Variables](#environment-variables)
  - [Setup](#setup)
  - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [Notes:](#notes)
  - [License](#license)

## Features

- Create local backups of MongoDB databases.
- Compress backup folders into ZIP files.
- Upload backup files to Google Drive.
- Store backups either locally or in Google Drive.
- Manage backup operations via RESTful API endpoints.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- `zip-a-folder`
- Google Drive API
- `dotenv` for environment variable management

## Environment Variables

To run the application, create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=5000
DB_NAME=<Your MongoDB Database Name>
DB_USERNAME=<Your MongoDB Username>
DB_PASSWORD=<Your MongoDB Password>
DB_HOST=<Your MongoDB Host>
PARENT_FOLDER_ID=<Google Drive Parent Folder ID>
GOOGLE_PROJECT_ID=<Your Google Cloud Project ID>
GOOGLE_PRIVATE_KEY_ID=<Your Google Private Key ID>
GOOGLE_PRIVATE_KEY=<Your Google Private Key>
GOOGLE_CLIENT_EMAIL=<Your Google Client Email>
GOOGLE_CLIENT_ID=<Your Google Client ID>
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/<Your Google Client Email>
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
```

## Setup

Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

Install the dependencies:

```bash
npm install
```

Set up your MongoDB and Google Drive API credentials as described in the environment variables section.

Start the application:

```bash
npm start
```

## Usage

Once the application is running, you can use the following API endpoints to manage backups.

### API Endpoints

1. **Create a Local Backup**

   **URL:** `/backup/local`

   **Method:** `POST`

   **Description:** Creates a backup of the MongoDB database, compresses it into a `.zip` file, and stores the file locally on your server.

   **Response:**

   - On success, the `.zip` file containing the backup will be available for download.

2. **Create a Google Drive Backup**

   **URL:** `/backup/google-drive`

   **Method:** `POST`

   **Description:** Creates a backup of the MongoDB database, compresses it into a `.zip` file, and uploads the backup to Google Drive.

   **Response:**

   - On success, the `.zip` file containing the backup will be uploaded to Google Drive.

### Notes:

- **Local Storage:** The backups are stored in a specified local directory as a `.zip` file. After download, the temporary folder is deleted.
- **Google Drive:** When using the Google Drive backup option, the backup `.zip` file is uploaded to a specified Google Drive folder, and the local copy is deleted after a successful upload.

## License

This project is licensed under the MIT License.

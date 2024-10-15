import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

dotenv.config();

// Initialize S3 client with credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3_BUCKET = process.env.AWS_BUCKET_NAME;

// Utility function to log S3 parameters and results
const logS3Params = (operation: string, params: object) => {
  console.log(`S3 ${operation} operation with params:`, params);
};

// Generates a presigned URL for uploading a file to S3 with a unique file name.
// @param {string} fileName - The original name of the file to upload.
// @param {string} fileType - The MIME type of the file.
// @returns {Promise<{ url: string, fileName: string }>} - A presigned URL for uploading.
export const generateUploadURL = (fileName: string, fileType: string): Promise<{ url: string; fileName: string }> => {
  // Create a unique file name by appending a UUID
  const uniqueFileName = `${uuidv4()}-${fileName}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: uniqueFileName, // Use the unique file name
    Expires: 60, // URL expiration time in seconds
    ContentType: fileType,
  };

  // Log parameters
  logS3Params('putObject', params);

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        console.error('Error generating S3 presigned URL:', err);
        return reject(new Error(`Failed to generate presigned URL for file upload: ${err.message}`));
      }
      console.log('Generated Unique File Name:', uniqueFileName);

      resolve({ url, fileName: uniqueFileName }); // Return both URL and fileName
    });
  });
};

// Generates a presigned URL for downloading a file from S3.
// @param {string} fileName - The name of the file to download.
// @returns {Promise<string>} - A presigned URL for downloading.
export const generateDownloadURL = (fileName: string): Promise<string> => {
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60, // URL expiration time in seconds
  };

  // Log parameters
  logS3Params('getObject', params);

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.error('Error generating S3 download URL:', err);
        return reject(new Error(`Failed to generate presigned URL for file download: ${err.message}`));
      }
      console.log('Successfully generated S3 presigned download URL:', url);
      resolve(url);
    });
  });
};

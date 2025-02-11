// server/utils/s3.js
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export function generatePresignedUrl(fileName, fileType) {
  const key = `uploads/${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: 3600, // 1 hour
    ContentType: fileType,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) return reject(err);
      resolve({ url, key });
    });
  });
}

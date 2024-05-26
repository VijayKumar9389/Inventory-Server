import { S3Client } from '@aws-sdk/client-s3';

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing required environment variables');
}

// Create an S3 client
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    region: region,
});

export { s3, bucketName };

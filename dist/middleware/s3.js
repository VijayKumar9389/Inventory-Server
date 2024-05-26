"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketName = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const bucketName = process.env.BUCKET_NAME;
exports.bucketName = bucketName;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing required environment variables');
}
// Create an S3 client
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    region: region,
});
exports.s3 = s3;

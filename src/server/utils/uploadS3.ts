import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export async function uploadHtmlToS3(html: string, key: string) {
  const bucketName = process.env.AWS_BUCKET_NAME;

  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: html,
    ContentType: "text/html",
  }));

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
}
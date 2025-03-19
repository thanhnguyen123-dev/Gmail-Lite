import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

class S3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor(bucketName: string, region: string) {
    this.bucketName = bucketName;
    this.region = region;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  public async uploadHtmlToS3(html: string, key: string) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: html,
      ContentType: "text/html",
    }));

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  public async fetchHtmlFromS3(url: string | null) {
    if (!url) return "";
    try {
      const response = await fetch(url);
      const html = await response.text();
      return html;
    } catch (error) {
      console.error("Error fetching HTML from S3:", error);
      return "";
    }
  }
}

export const s3Service = new S3Service(process.env.AWS_BUCKET_NAME ?? "", process.env.AWS_REGION ?? "");
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { simpleParser } from 'mailparser';
import { s3Service } from './s3Service';

export async function parseRawEmail(rawBase64: string, messageId: string) {
  try {
    const base64 = rawBase64.replace(/-/g, "+").replace(/_/g, "/");
    const mimeStr = Buffer.from(base64, 'base64').toString('utf-8');
    const parsed = await simpleParser(mimeStr);

    let fromText = "";
    if (Array.isArray(parsed.from) && parsed.from.length > 0) {
      fromText = parsed.from.map((address) => address.text).join(", ");
    } else if (parsed.from && typeof parsed.from === 'object' && 'text' in parsed.from) {
      fromText = parsed.from.text;
    }

    let toText = "";
    if (Array.isArray(parsed.to) && parsed.to.length > 0) {
      toText = parsed.to.map((address) => address.text).join(", ");
    } else if (parsed.to && typeof parsed.to === 'object' && 'text' in parsed.to) {
      toText = parsed.to.text;
    }

    const htmlContent = typeof parsed.html === 'boolean' ? null : (parsed.html || null);

    let htmlUrl = null;
    if (htmlContent) {
      const key = `emails/${messageId}/content.html`;
      htmlUrl = await s3Service.uploadHtmlToS3(htmlContent, key);
    }

    return {
      subject: parsed.subject ?? '',
      from: fromText,
      to: toText,
      date: parsed.date ? new Date(parsed.date).toLocaleDateString() : '',
      html: htmlUrl,
    }
  } catch (error) {
    console.error("Error parsing email:", error);
    return {
      subject: '',
      from: '',
      to: '',
      date: '',
      html: null,
    }
  }
}
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { simpleParser } from 'mailparser';


export async function parseRawEmail(rawBase64: string) {
  const base64 = rawBase64.replace(/-/g, "+").replace(/_/g, "/");
  const mimeStr = Buffer.from(base64, 'base64').toString('utf-8');
  const parsed = await simpleParser(mimeStr);

  let fromText = "";
  if (Array.isArray(parsed.from) && parsed.from.length > 0) {
    fromText = parsed.from.map((address) => address.text).join(", ");
  } else if (parsed.from && typeof parsed.from === 'object' && 'text' in parsed.from) {
    fromText = parsed.from.text;
  }

  return {
    subject: parsed.subject ?? '',
    from: fromText,
    to: parsed.to ?? '',
    date: parsed.date ?? '',
    text: parsed.text ?? '',
    html: parsed.html ?? '',
  }
}
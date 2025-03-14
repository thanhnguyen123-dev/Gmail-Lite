declare module 'eml-parser' {
  export class EmlParser {
    constructor(eml: string);
    parse(): Promise<{
      subject?: string;
      from?: string;
      to?: string;
      date?: string;
      text?: string;
      html?: string;
      attachments?: Array<{
        filename: string;
        contentType: string;
        content: Buffer;
      }>;
      headers?: Record<string, string>;
    }>
  }
}
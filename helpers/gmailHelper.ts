import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export class GmailHelper {
  private gmail;

  constructor() {
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const tokenPath = path.join(process.cwd(), 'token.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error('credentials.json not found');
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const message = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }

  async waitForEmail(subject: string, maxWaitTime: number = 30000): Promise<{ subject: string; body: string }> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: `subject:"${subject}" is:unread`,
        maxResults: 1,
      });

      if (response.data.messages && response.data.messages.length > 0) {
        const messageId = response.data.messages[0].id!;
        const message = await this.gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full',
        });

        await this.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            removeLabelIds: ['UNREAD'],
          },
        });

        const headers = message.data.payload?.headers || [];
        const subjectHeader = headers.find((h) => h.name === 'Subject');
        const emailSubject = subjectHeader?.value || '';

        let emailBody = '';
        const parts = message.data.payload?.parts;
        if (parts) {
          const textPart = parts.find((p) => p.mimeType === 'text/plain');
          if (textPart?.body?.data) {
            emailBody = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
          }
        } else if (message.data.payload?.body?.data) {
          emailBody = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
        }

        return { subject: emailSubject, body: emailBody };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error(`Email with subject "${subject}" not found within ${maxWaitTime}ms`);
  }
}

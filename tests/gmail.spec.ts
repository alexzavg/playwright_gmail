import { test, expect } from '@playwright/test';
import { GmailHelper } from '../helpers/gmailHelper';

test.describe('Gmail API Test', () => {
  let gmailHelper: GmailHelper;

  test.beforeAll(() => {
    gmailHelper = new GmailHelper();
  });

  test('should send and receive email with correct subject and body', async () => {
    const testEmail = process.env.GMAIL_ADDRESS || 'your-email@gmail.com';
    const testSubject = `Test Email ${Date.now()}`;
    const testBody = 'This is a test email body from Playwright automation';

    await gmailHelper.sendEmail(testEmail, testSubject, testBody);

    const receivedEmail = await gmailHelper.waitForEmail(testSubject);

    expect(receivedEmail.subject).toBe(testSubject);
    expect(receivedEmail.body.trim()).toBe(testBody);
  });
});

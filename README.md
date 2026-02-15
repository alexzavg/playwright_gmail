# Playwright Gmail API Test

Minimal setup for testing Gmail via API using Playwright and TypeScript.

## Installation

```bash
npm install
```

## Gmail API Setup

### 1. Create a project in Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Create a new project (or select an existing one) 
![Screenshot](screenshots/1.png)

### 2. Enable Gmail API

1. In the left menu, select **APIs & Services** → **Library**
![Screenshot](screenshots/2.png)
![Screenshot](screenshots/3.png)
2. Search for **Gmail API**
![Screenshot](screenshots/4.png)
![Screenshot](screenshots/5.png)
3. Click **Enable**
![Screenshot](screenshots/6.png)

### 3. Create OAuth 2.0 credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
![Screenshot](screenshots/7.png)
3. If prompted to configure OAuth consent screen:
   - Select **External**
   - Fill in the application name
   - Save
![Screenshot](screenshots/8.png)
![Screenshot](screenshots/9.png)
4. Select **Application type**: **Desktop app**
5. Give it a name (e.g., "Gmail Test")
6. Click **Create**
![Screenshot](screenshots/10.png)
7. Download the JSON file and save it as `credentials.json` in the project root
![Screenshot](screenshots/11.png)
![Screenshot](screenshots/12.png)
8. Go to **Test users** section and add your Gmail address that you'll use for testing (this is required to avoid "access_denied" error)
![Screenshot](screenshots/13.png)

### 4. Get access token

Run the authorization script:

```bash
node auth.js
```

A browser will open, log in with your Gmail account and grant permissions. After that, a `token.json` file will be created.
![Screenshot](screenshots/14.png)
![Screenshot](screenshots/15.png)
![Screenshot](screenshots/16.png)
![Screenshot](screenshots/17.png)

### 5. Configure email

Copy `.env.example` to `.env` and specify your Gmail address:

```bash
cp .env.example .env
```

Edit `.env`:
```
GMAIL_ADDRESS=your-email@gmail.com
```

## Run the test

```bash
npm test
```

## What the test does

1. Sends an email with test subject and body to the same Gmail address
2. Waits for the email via Gmail API
3. Verifies that the subject matches
4. Verifies that the body matches

IN CASE OF SUCCESS YOU SHOULD SEE SOMETHING LIKE THIS:
![Screenshot](screenshots/18.png)
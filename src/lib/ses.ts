import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

// On AWS Amplify's Next.js SSR (Compute) runtime, the SDK's implicit default
// credential resolution can fail with "Could not load credentials from any
// providers". Explicitly using the node provider chain resolves the container
// role credentials that Amplify injects (AWS_CONTAINER_CREDENTIALS_* env vars),
// while still falling back to env/instance creds locally.
const sesClient = new SESClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: fromNodeProviderChain(),
});

interface ContactNotificationData {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  submittedAt: Date;
}

export async function sendContactNotification(
  data: ContactNotificationData
): Promise<void> {
  const fromEmail = process.env.SES_FROM_EMAIL ?? "noreply@araji.com";
  const toEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? "bonahid@araji.com";
  const emailSubject = `New Contact Form Submission — ${data.subject ?? "No Subject"}`;

  const bodyText = `
You have received a new message via your website contact form.

Name:     ${data.name}
Email:    ${data.email}
Subject:  ${data.subject ?? "No Subject"}
Date:     ${data.submittedAt.toLocaleString("en-US", { timeZone: "UTC" })} UTC

Message:
${data.message}
  `.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="border-bottom: 3px solid #db8c28; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #3c1e0b; font-size: 20px; margin: 0;">New Contact Form Submission</h1>
    <p style="color: #777; margin: 4px 0 0 0; font-size: 14px;">Ibrahim Fawaz Araji — Book Publisher Website</p>
  </div>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 100px; color: #777; font-size: 14px;">Name</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${escapeHtml(data.name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777; font-size: 14px;">Email</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.email)}" style="color: #db8c28;">${escapeHtml(data.email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777; font-size: 14px;">Subject</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.subject ?? "No Subject")}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777; font-size: 14px;">Date</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.submittedAt.toLocaleString("en-US", { timeZone: "UTC" })} UTC</td>
    </tr>
  </table>

  <div style="background: #fdf8f0; border-left: 4px solid #db8c28; padding: 16px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px 0; color: #777; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
    <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  </div>

  <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px;">
    This notification was sent automatically from your book publisher website.
  </p>
</body>
</html>
  `.trim();

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: emailSubject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: bodyText,
          Charset: "UTF-8",
        },
        Html: {
          Data: bodyHtml,
          Charset: "UTF-8",
        },
      },
    },
  });

  await sesClient.send(command);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

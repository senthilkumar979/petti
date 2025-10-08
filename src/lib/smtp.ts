import nodemailer from "nodemailer";
import { SMTPConfig, EmailTestResult } from "@/types/smtp";

export class SMTPService {
  private transporter: nodemailer.Transporter | null = null;
  private config: SMTPConfig | null = null;

  constructor(config?: SMTPConfig) {
    if (config) {
      this.setConfig(config);
    }
  }

  setConfig(config: SMTPConfig): void {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
  }

  async testConnection(): Promise<EmailTestResult> {
    if (!this.transporter) {
      return {
        success: false,
        message: "No SMTP configuration found",
        error: "SMTP not configured",
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: "SMTP connection successful",
      };
    } catch (error) {
      return {
        success: false,
        message: "SMTP connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async sendEmail(options: {
    to: string | string[];
    cc?: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<EmailTestResult> {
    if (!this.transporter || !this.config) {
      return {
        success: false,
        message: "No SMTP configuration found",
        error: "SMTP not configured",
      };
    }

    try {
      const mailOptions = {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(", ")
            : options.cc
          : undefined,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: `Email sent successfully. Message ID: ${result.messageId}`,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async sendTestEmail(to: string): Promise<EmailTestResult> {
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SMTP Test Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🧪 SMTP Test Email</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #495057; margin-top: 0;">Hello!</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            This is a test email to verify that your SMTP configuration is working correctly.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">✅ SMTP Configuration Successful</h3>
            <p style="margin: 0; color: #6c757d;">
              Your email settings are properly configured and working!
            </p>
          </div>
          
          <p style="margin-bottom: 0; color: #6c757d; font-size: 14px;">
            This test was sent from your Petti subscription management system.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: "🧪 SMTP Test Email from Petti",
      html: testHtml,
      text: "This is a test email to verify that your SMTP configuration is working correctly.",
    });
  }
}

// Global SMTP service instance
let globalSMTP: SMTPService | null = null;

export function getSMTPService(): SMTPService | null {
  return globalSMTP;
}

export function setGlobalSMTP(config: SMTPConfig): void {
  globalSMTP = new SMTPService(config);
}

export function clearGlobalSMTP(): void {
  globalSMTP = null;
}

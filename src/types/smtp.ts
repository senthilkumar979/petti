export interface SMTPConfig {
  id: string;
  provider: "gmail" | "outlook" | "zoho" | "custom";
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailProvider {
  name: string;
  host: string;
  port: number;
  secure: boolean;
  description: string;
}

export const EMAIL_PROVIDERS: EmailProvider[] = [
  {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    description: "Gmail SMTP (requires App Password)",
  },
  {
    name: "Outlook",
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    description: "Outlook/Hotmail SMTP",
  },
  {
    name: "Zoho",
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    description: "Zoho Mail SMTP",
  },
  {
    name: "Custom",
    host: "",
    port: 587,
    secure: false,
    description: "Custom SMTP server",
  },
];

export interface EmailTestResult {
  success: boolean;
  message: string;
  error?: string;
}

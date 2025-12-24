"use client";

import SMTPConfiguration from "@/components/organisms/SMTPConfiguration";
import { SMTPConfig } from "@/types/smtp";
import { useState } from "react";

export default function EmailSettings() {
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig | null>(null);

  console.log("🟣 EmailSettings: Component rendered");

  const handleConfigChange = (config: SMTPConfig | null) => {
    setSmtpConfig(config);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email Settings
        </h2>
        <p className="text-gray-600">
          Configure SMTP settings to send subscription reminder emails using
          your own email provider.
        </p>
      </div>

      <SMTPConfiguration onConfigChange={handleConfigChange} />

      {smtpConfig && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ SMTP Configuration Active
          </h3>
          <p className="text-sm text-green-800">
            Your subscription reminders will be sent using {smtpConfig.provider}{" "}
            SMTP.
          </p>
        </div>
      )}
    </div>
  );
}

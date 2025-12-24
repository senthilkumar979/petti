"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { useToast } from "@/hooks/useToast";
import { EMAIL_PROVIDERS, SMTPConfig } from "@/types/smtp";
import { useEffect, useState } from "react";

interface SMTPConfigurationProps {
  onConfigChange?: (config: SMTPConfig | null) => void;
}

export default function SMTPConfiguration({
  onConfigChange,
}: SMTPConfigurationProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<Partial<SMTPConfig>>({
    provider: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    username: "",
    password: "",
    fromName: "Petti Subscriptions",
    fromEmail: "",
    isActive: false,
  });

  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testResult, setTestResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("🟣 SMTPConfiguration: Component mounted");
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfig = async () => {
    console.log("🟣 SMTPConfiguration: Loading config");
    try {
      const response = await fetch("/api/smtp/config");
      const data = await response.json();

      if (data.success && data.config) {
        console.log("🟣 SMTPConfiguration: Config loaded successfully");
        setConfig(data.config);
        onConfigChange?.(data.config);
      } else {
        console.log("🟣 SMTPConfiguration: No config found");
      }
    } catch (error) {
      console.error("🟣 SMTPConfiguration: Error loading SMTP config:", error);
    }
  };

  const handleProviderChange = (provider: string) => {
    const selectedProvider = EMAIL_PROVIDERS.find(
      (p) => p.name.toLowerCase() === provider.toLowerCase()
    );
    if (selectedProvider) {
      setConfig((prev) => ({
        ...prev,
        provider: provider as SMTPConfig["provider"],
        host: selectedProvider.host,
        port: selectedProvider.port,
        secure: selectedProvider.secure,
      }));
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!config.host || !config.port || !config.username || !config.password || !config.fromEmail) {
      toast({
        title: "❌ Missing Required Fields",
        description: "Please fill in all required fields (Host, Port, Username, Password, From Email)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/smtp/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Success",
          description: "SMTP configuration saved successfully!",
          variant: "success",
        });
        setConfig(data.config);
        onConfigChange?.(data.config);
      } else {
        toast({
          title: "❌ Error",
          description: data.error || "Failed to save configuration",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "❌ Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail) {
      toast({
        title: "❌ Missing Test Email",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    // Check if SMTP configuration is complete
    if (!config.host || !config.port || !config.username || !config.password || !config.fromEmail) {
      toast({
        title: "❌ Incomplete Configuration",
        description: "Please complete all SMTP configuration fields before testing",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setMessage("");

    try {
      const response = await fetch("/api/smtp/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
          testEmail,
        }),
      });

      const data = await response.json();
      setTestResult(data);

      if (data.success) {
        toast({
          title: "✅ Test Email Sent",
          description: "Test email sent successfully! Check your inbox.",
          variant: "success",
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: data.error || data.message || "Unknown error",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "❌ Test Failed",
        description: "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the SMTP configuration?")) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/smtp/config", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ SMTP configuration deleted successfully!");
        const defaultConfig = {
          provider: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          username: "",
          password: "",
          fromName: "Petti Subscriptions",
          fromEmail: "",
          isActive: false,
        };
        setConfig(defaultConfig as Partial<SMTPConfig>);
        onConfigChange?.(null);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setMessage("❌ Failed to delete configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("✅")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">SMTP Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <Select
                value={config.provider || "gmail"}
                onChange={(e) => handleProviderChange(e.target.value)}
                options={EMAIL_PROVIDERS.map((provider) => ({
                  value: provider.name.toLowerCase(),
                  label: `${provider.name} - ${provider.description}`,
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <Input
                type="text"
                value={config.host || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, host: e.target.value }))
                }
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <Input
                  type="number"
                  value={config.port || 587}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      port: parseInt(e.target.value),
                    }))
                  }
                  placeholder="587"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.secure || false}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        secure: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Use SSL/TLS</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email
              </label>
              <Input
                type="email"
                value={config.username || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password/App Password
              </label>
              <Input
                type="password"
                value={config.password || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Your email password or app password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <Input
                type="text"
                value={config.fromName || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, fromName: e.target.value }))
                }
                placeholder="Petti Subscriptions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <Input
                type="email"
                value={config.fromEmail || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, fromEmail: e.target.value }))
                }
                placeholder="noreply@yourdomain.com"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              disabled={isLoading || !config.isActive}
            >
              Delete
            </Button>
          </div>
        </Card>

        {/* Test Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <Button
              onClick={handleTest}
              disabled={isTesting || !testEmail}
              className="w-full"
            >
              {isTesting ? "Sending Test Email..." : "Send Test Email"}
            </Button>

            {testResult && (
              <div
                className={`p-4 rounded-lg ${
                  testResult.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <p className="text-sm">{testResult.message}</p>
                {testResult.connectionTest && (
                  <p className="text-sm mt-1">
                    Connection:{" "}
                    {testResult.connectionTest.success
                      ? "✅ Success"
                      : "❌ Failed"}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              📧 Email Provider Setup Guides:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>Gmail:</strong> Use App Password (not regular password)
              </li>
              <li>
                <strong>Outlook:</strong> Use your regular email and password
              </li>
              <li>
                <strong>Zoho:</strong> Use your Zoho Mail credentials
              </li>
              <li>
                <strong>Custom:</strong> Enter your SMTP server details
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

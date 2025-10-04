"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SetupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the admin user
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (signUpError) {
        setError(
          signUpError instanceof Error
            ? signUpError.message
            : "Failed to create admin account"
        );
        setIsLoading(false);
        return;
      }

      // Registration successful! The handle_new_user() trigger will automatically
      // create the user profile in the database. We just need to redirect to login.
      console.log(
        "Admin account created successfully! Redirecting to login..."
      );

      // Wait a moment for the trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Petti
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Let&apos;s set up your admin account to get started with your
                modern NextJS application
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🚀 What you&apos;ll get
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>
                      Complete user authentication system powered by Supabase
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Admin dashboard for managing users and settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Modern UI built with Tailwind CSS and Radix UI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>
                      TypeScript for type safety and better development
                      experience
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Responsive design that works on all devices</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  🔧 Setup Process
                </h3>
                <div className="space-y-2 text-blue-800">
                  <p className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      1
                    </span>
                    Create your admin account with email and password
                  </p>
                  <p className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      2
                    </span>
                    Your profile will be automatically created in the database
                  </p>
                  <p className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      3
                    </span>
                    Access the admin dashboard to manage your organization
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🛡️ Security Features
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>
                    • Row Level Security (RLS) enabled on all database tables
                  </li>
                  <li>• Secure password requirements and validation</li>
                  <li>• JWT-based authentication with Supabase</li>
                  <li>• Protected routes and API endpoints</li>
                  <li>• Automatic session management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Admin Account
                </h2>
                <p className="text-gray-600">
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a secure password"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

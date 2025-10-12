"use client";

import { useAuth } from "@/lib/auth-context";
import { registerServiceWorker } from "@/lib/pwa";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "../components/atoms/Card";
import Dashboard from "../components/organisms/Dashboard";
import { Header } from "../components/organisms/Header/Header";

export default function HomePage() {
  const { fetchAllUsers, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Auth Debug:", {
          authLoading,
          user: !!user,
          showLogin,
          pathname,
          currentRoute: pathname,
        });

        const { data, error: fetchError } = await fetchAllUsers();

        if (fetchError) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load users"
          );
          return;
        }

        // If no users exist, show admin setup
        if (!data || data.length === 0) {
          console.log("📝 No users found, redirecting to setup");
          router.push("/setup");
          setShowLogin(false);
        } else {
          // If users exist but no one is logged in, show login
          if (!user) {
            console.log("👤 No user logged in, showing login");
            setShowLogin(true);
          } else {
            // User is logged in, show dashboard
            console.log("✅ User logged in, showing dashboard");
            setShowLogin(false);
            setHasRedirected(false); // Reset redirect flag
            // No need to redirect since we're already on the homepage
          }
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Only load users if authentication is not loading
    if (!authLoading) {
      loadUsers();
    }
  }, [fetchAllUsers, router, authLoading, user, pathname, showLogin]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Petti"
            width="150"
            height="150"
            className="mb-5"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    // Only redirect if we're not already on the login page and haven't redirected yet
    if (pathname !== "/login" && !hasRedirected) {
      console.log("🔄 Redirecting to login page");
      setHasRedirected(true);
      router.push("/login");
    }
    return null; // Prevent rendering the rest of the component
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Users
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  // User is logged in, show dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-800">
              Kalanchiya Petti
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your statistics dashboard
            </p>
          </div>
          <Image
            src="/logo.png"
            alt="Petti"
            width="100"
            height="100"
            className="mb-5"
          />
        </div>
        <Dashboard />
      </div>
    </div>
  );
}

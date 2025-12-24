"use client";

import { useAuth } from "@/lib/auth-context";
import { registerServiceWorker } from "@/lib/pwa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card } from "../components/atoms/Card";
import Dashboard from "../components/organisms/Dashboard";
import { Header } from "../components/organisms/Header/Header";

export default function HomePage() {
  const { fetchAllUsers, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const hasLoadedOnceRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Skip if tab is currently hidden (user switched away)
    if (document.hidden) {
      console.log("🏠 HomePage: Tab is hidden, skipping loadUsers");
      return;
    }

    // Skip if we've already loaded once and this is just a tab focus change
    if (hasLoadedOnceRef.current) {
      console.log("🏠 HomePage: Already loaded, skipping on tab focus");
      return;
    }

    console.log("🏠 HomePage: useEffect triggered", {
      authLoading,
      hasUser: !!user,
    });

    // Prevent multiple simultaneous calls
    let isMounted = true;

    const loadUsers = async () => {
      if (!isMounted) {
        console.log("🏠 HomePage: Component unmounted, skipping loadUsers");
        return;
      }

      try {
        console.log("🏠 HomePage: Starting to load users");
        setLoading(true);
        setError(null);

        const startTime = Date.now();
        console.log("🏠 HomePage: Calling fetchAllUsers...");
        const { data, error: fetchError } = await fetchAllUsers();
        const duration = Date.now() - startTime;

        if (!isMounted) {
          console.log(
            "🏠 HomePage: Component unmounted during fetch, ignoring result"
          );
          return;
        }

        console.log("🏠 HomePage: fetchAllUsers returned", {
          duration: `${duration}ms`,
          hasError: !!fetchError,
          dataCount: data?.length || 0,
        });

        if (fetchError) {
          console.error("🏠 HomePage: Error fetching users", fetchError);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load users"
          );
          setLoading(false);
          return;
        }

        console.log("🏠 HomePage: Users fetched", {
          count: data?.length || 0,
          hasUser: !!user,
        });

        // If no users exist, show admin setup
        if (!data || data.length === 0) {
          console.log("🏠 HomePage: No users found, redirecting to setup");
          router.push("/setup");
          setLoading(false);
          hasLoadedOnceRef.current = true;
          return;
        }

        // If users exist but no one is logged in, show login
        if (!user) {
          console.log("🏠 HomePage: No user logged in, redirecting to login");
          if (!hasRedirected) {
            setHasRedirected(true);
            router.push("/login");
          }
          setLoading(false);
          hasLoadedOnceRef.current = true;
          return;
        }

        // User is logged in, show dashboard
        console.log("🏠 HomePage: User logged in, showing dashboard");
        setLoading(false);
        hasLoadedOnceRef.current = true;
      } catch (err) {
        console.error("🏠 HomePage: Unexpected error", err);
        if (isMounted) {
          setError("An unexpected error occurred");
          setLoading(false);
        }
      }
    };

    // Only load users if authentication is not loading
    if (!authLoading) {
      loadUsers();
    } else {
      console.log("🏠 HomePage: Waiting for auth to finish loading");
    }

    return () => {
      isMounted = false;
      console.log("🏠 HomePage: Cleanup - component unmounting");
    };
  }, [authLoading, user, router, fetchAllUsers, hasRedirected]);

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

  // If user is not logged in, the useEffect will handle redirect
  if (!user && !authLoading && !loading) {
    return null; // Prevent rendering while redirecting
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

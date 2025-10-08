"use client";

import { DropdownMenu } from "@/components/molecules/DropdownMenu";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../../atoms/Badge";
import { useHandleMenu } from "./useHandleMenu";

/**
 * Header component for authenticated users
 *
 * Features:
 * - App name on the left side
 * - User greeting with name on the right side
 * - Dropdown menu with user actions (Profile, Settings, Help, Logout)
 * - User avatar with fallback to initials
 * - Fully responsive design
 *
 * Only renders when user is authenticated
 */
interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, userProfile } = useAuth();
  const { menuItems } = useHandleMenu();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const getUserDisplayName = () => {
    if (userProfile?.name) {
      return userProfile.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Don't render if user is not authenticated
  if (!user) return null;

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between h-16">
        {/* App Name - Left Side */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="Petti" width="50" height="50" />
          <h1 className="ml-4 text-xl font-bold text-gray-900">PETTI</h1>
          <div className="block sm:hidden">
            <Badge variant="warning" size="xs" className="ml-4">
              v0.1.0-beta
            </Badge>
          </div>
        </div>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            href="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            href="/subscriptions"
            onClick={closeMobileMenu}
          >
            Subscriptions
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            href="/documents"
            onClick={closeMobileMenu}
          >
            Documents
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            href="/contacts"
            onClick={closeMobileMenu}
          >
            Contacts
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            href="/notes"
            onClick={closeMobileMenu}
          >
            Notes
          </Link>
        </nav>

        {/* Right Side - User Info and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {/* User Greeting - Hidden on mobile */}
          <div className="hidden md:block text-sm text-gray-600">
            {getUserGreeting()},{" "}
            <span className="font-medium text-gray-900">
              {getUserDisplayName()}
            </span>
          </div>

          {/* Mobile Menu Button */}
          {isMobileMenuOpen ? (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* User Menu Dropdown - Hidden on mobile */}
          <div className="sm:block">
            <DropdownMenu
              trigger={
                <button className="cursor-pointer flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-offset-2 rounded-md p-1">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {userProfile?.picture ? (
                      <Image
                        src={userProfile.picture}
                        alt={getUserDisplayName()}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              }
              items={menuItems}
              align="right"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Mobile User Info */}
            <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-200">
              {getUserGreeting()},{" "}
              <span className="font-medium text-gray-900">
                {getUserDisplayName()}
              </span>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              href="/"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              href="/subscriptions"
              onClick={closeMobileMenu}
            >
              Subscriptions
            </Link>
            <Link
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              href="/documents"
              onClick={closeMobileMenu}
            >
              Documents
            </Link>
            <Link
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              href="/contacts"
              onClick={closeMobileMenu}
            >
              Contacts
            </Link>
            <Link
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              href="/notes"
              onClick={closeMobileMenu}
            >
              Notes
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

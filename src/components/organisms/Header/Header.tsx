"use client";

import { DropdownMenu } from "@/components/molecules/DropdownMenu";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Badge } from "../../atoms/Badge";
import { useHandleMenu } from "./useHandleMenu";
import Image from "next/image";

/**
 * Header component for authenticated users
 *
 * Features:
 * - App name on the left side
 * - User greeting with name on the right side
 * - Dropdown menu with user actions (Profile, Settings, Help, Logout)
 * - User avatar with fallback to initials
 * - Responsive design (greeting hidden on small screens)
 *
 * Only renders when user is authenticated
 */
interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, userProfile } = useAuth();
  const { menuItems } = useHandleMenu();

  // Don't render if user is not authenticated
  if (!user) return null;

  const getUserDisplayName = () => {
    if (userProfile?.name) {
      return userProfile.name;
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user.email?.split("@")[0] || "User";
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between h-16">
        {/* App Name - Left Side */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">PETTI</h1>
          <Badge variant="warning" size="xs" className="ml-4">
            v0.1.0-beta
          </Badge>
        </div>

        <div>
          <ul className="flex items-center space-x-10">
            <li>
              <Link className="text-gray-700 hover:text-gray-900" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 hover:text-gray-900"
                href="/subscriptions"
              >
                Subscriptions
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 hover:text-gray-900"
                href="/documents"
              >
                Documents
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 hover:text-gray-900"
                href="/contacts"
              >
                Contacts
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" href="/notes">
                Notes
              </Link>
            </li>
          </ul>
        </div>

        {/* User Info and Menu - Right Side */}
        <div className="flex items-center space-x-4">
          {/* User Greeting */}
          <div className="hidden sm:block text-sm text-gray-600">
            {getUserGreeting()},{" "}
            <span className="font-medium text-gray-900">
              {getUserDisplayName()}
            </span>
          </div>

          {/* User Menu Dropdown */}
          <DropdownMenu
            trigger={
              <button className="cursor-pointer flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none  focus:ring-offset-2 rounded-md p-1">
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
    </header>
  );
};

"use client";

import { Button } from "@/components/atoms/Button";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { useAuth } from "@/lib/auth-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/atoms/Badge";
import { getCategoryColor, getCategoryName } from "./util";

interface RenewalReminder {
  id: string;
  subscription_id: string;
  reminder_date: string;
  subscription_name: string;
}

interface CalendarViewProps {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];
  users: User[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  subscriptions,
  categories,
  onEdit,
}) => {
  const { fetchRenewalReminders } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);

  // Fetch renewal reminders on mount and when month changes
  useEffect(() => {
    const loadRenewalReminders = async () => {
      try {
        setLoadingReminders(true);
        const { data, error } = await fetchRenewalReminders();
        if (error) {
          console.error("Error loading renewal reminders:", error);
          return;
        }
        if (data) {
          setRenewalReminders(data);
        }
      } catch (err) {
        console.error("Error loading renewal reminders:", err);
      } finally {
        setLoadingReminders(false);
      }
    };

    loadRenewalReminders();
  }, [fetchRenewalReminders, currentDate]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  // Get renewal reminders for a specific date
  const getRenewalRemindersForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    return renewalReminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminder_date);
      return (
        reminderDate.getFullYear() === date.getFullYear() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getDate() === date.getDate()
      );
    });
  };

  const getSubscriptionsForMonth = (date: Date) => {
    // Use renewal reminders for the month
    const monthReminders = renewalReminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminder_date);
      return (
        reminderDate.getFullYear() === date.getFullYear() &&
        reminderDate.getMonth() === date.getMonth()
      );
    });
    return monthReminders;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthReminders = getSubscriptionsForMonth(currentDate);
  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const days = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      return {
        day,
        date,
        reminders: getRenewalRemindersForDate(date),
        isToday: isCurrentMonth && day === today.getDate(),
      };
    }),
  ];

  return (
    <div className="space-y-6 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">
            {formatMonthYear(currentDate)}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {monthReminders.length} renewal
          {monthReminders.length !== 1 ? "s" : ""} this month
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((dayData, index) => (
            <div
              key={index}
              className={`min-h-[100px] border-r border-b border-gray-200 p-2 ${
                dayData?.isToday ? "bg-blue-50" : "bg-white"
              } hover:bg-gray-50 transition-colors`}
            >
              {dayData ? (
                <div className="h-full">
                  <div
                    className={`text-sm font-medium mb-2 ${
                      dayData.isToday
                        ? "text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center"
                        : "text-gray-900"
                    }`}
                  >
                    {dayData.day}
                  </div>
                  <div className="space-y-1">
                    {dayData.reminders.slice(0, 3).map((reminder) => {
                      // Find the subscription to get category for color
                      const subscription = subscriptions.find(
                        (sub) => sub.id === reminder.subscription_id
                      );
                      return (
                        <Badge
                          key={reminder.id}
                          variant={
                            subscription
                              ? getCategoryColor(categories, subscription.category)
                              : "default"
                          }
                          size="small"
                        >
                          <button
                            onClick={() => {
                              if (subscription) {
                                onEdit(subscription);
                              }
                            }}
                            className="w-full text-left"
                          >
                            {reminder.subscription_name}
                          </button>
                        </Badge>
                      );
                    })}
                    {dayData.reminders.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayData.reminders.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-50"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm pb-5">
        {categories.map((category) => (
          <div key={category.id} className="">
            {getCategoryName(categories, category.id)}
          </div>
        ))}
      </div>
    </div>
  );
};

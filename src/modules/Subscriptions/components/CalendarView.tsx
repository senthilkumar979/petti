"use client";

import { Button } from "@/components/atoms/Button";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../components/atoms/Badge";
import { getCategoryColor, getCategoryName } from "./util";

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
  users,
  onEdit,
  onDelete,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getSubscriptionsForMonth = (date: Date) =>
    subscriptions.filter((sub) => {
      const renewalDate = new Date(sub.renewalDate);
      return (
        renewalDate.getFullYear() === date.getFullYear() &&
        renewalDate.getMonth() === date.getMonth()
      );
    });
  const getSubscriptionsForDate = (date: Date) =>
    subscriptions.filter((sub) => {
      const renewalDate = new Date(sub.renewalDate);
      return (
        renewalDate.getFullYear() === date.getFullYear() &&
        renewalDate.getMonth() === date.getMonth() &&
        renewalDate.getDate() === date.getDate()
      );
    });

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
  const monthSubscriptions = getSubscriptionsForMonth(currentDate);
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
        subscriptions: getSubscriptionsForDate(date),
        isToday: isCurrentMonth && day === today.getDate(),
      };
    }),
  ];

  return (
    <div className="space-y-6">
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
          {monthSubscriptions.length} subscription
          {monthSubscriptions.length !== 1 ? "s" : ""} this month
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
                    {dayData.subscriptions.slice(0, 3).map((subscription) => {
                      return (
                        <Badge
                          key={subscription.id}
                          variant={getCategoryColor(
                            categories,
                            subscription.category
                          )}
                          size="small"
                        >
                          <button
                            onClick={() => onEdit(subscription)}
                            className="w-full text-left"
                          >
                            {subscription.nameOfSubscription}
                          </button>
                        </Badge>
                      );
                    })}
                    {dayData.subscriptions.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayData.subscriptions.length - 3} more
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

      <div className="flex items-center justify-center gap-6 text-sm">
        {categories.map((category) => (
          <div key={category.id} className="">
            {getCategoryName(categories, category.id)}
          </div>
        ))}
      </div>
    </div>
  );
};

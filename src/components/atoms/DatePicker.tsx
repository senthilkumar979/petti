import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Rewind,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    value,
    onChange,
    label,
    error,
    helperText,
    placeholder = "Select date",
    disabled = false,
    className,
    minDate,
    maxDate,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value ? new Date(value) : null
    );
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update selected date when value prop changes
    useEffect(() => {
      if (value) {
        setSelectedDate(new Date(value));
      } else {
        setSelectedDate(null);
      }
    }, [value]);

    const formatDate = (date: Date): string => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getDaysInMonth = (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < new Date(minDate)) return true;
      if (maxDate && date > new Date(maxDate)) return true;
      return false;
    };

    const generateCalendarDays = (): CalendarDay[] => {
      const days: CalendarDay[] = [];
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDay = getFirstDayOfMonth(currentMonth);
      const today = new Date();

      // Previous month days
      const prevMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        0
      );
      const daysInPrevMonth = prevMonth.getDate();

      for (let i = firstDay - 1; i >= 0; i--) {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          daysInPrevMonth - i
        );
        days.push({
          date: date.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: selectedDate
            ? date.toDateString() === selectedDate.toDateString()
            : false,
          isDisabled: isDateDisabled(date),
        });
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        );
        days.push({
          date: day,
          isCurrentMonth: true,
          isToday: date.toDateString() === today.toDateString(),
          isSelected: selectedDate
            ? date.toDateString() === selectedDate.toDateString()
            : false,
          isDisabled: isDateDisabled(date),
        });
      }

      // Next month days to fill the grid
      const totalCells = Math.ceil(days.length / 7) * 7;
      for (let day = 1; days.length < totalCells; day++) {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          day
        );
        days.push({
          date: day,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: isDateDisabled(date),
        });
      }

      return days;
    };

    const handleDateSelect = (day: CalendarDay) => {
      if (day.isDisabled) return;

      const selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day.date
      );
      setSelectedDate(selectedDate);
      onChange(selectedDate.toISOString().split("T")[0]);
      setIsOpen(false);
    };

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        if (direction === "prev") {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    };

    const navigateYear = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        if (direction === "prev") {
          newMonth.setFullYear(prev.getFullYear() - 1);
        } else {
          newMonth.setFullYear(prev.getFullYear() + 1);
        }
        return newMonth;
      });
    };

    const goToToday = () => {
      const today = new Date();
      setCurrentMonth(today);
      setSelectedDate(today);
      onChange(today.toISOString().split("T")[0]);
      setIsOpen(false);
    };

    const calendarDays = generateCalendarDays();
    const monthYear = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all duration-200 hover:border-gray-400",
              error && "border-red-500 focus-visible:ring-red-500",
              isOpen && "ring-2 ring-blue-500 border-blue-500",
              className
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={cn(
                  "text-gray-900",
                  !selectedDate && "text-gray-500"
                )}
              >
                {selectedDate ? formatDate(selectedDate) : placeholder}
              </span>
              <div className="flex items-center space-x-2">
                {selectedDate && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(null);
                      onChange("");
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-2 right-5 w-90 bg-white border border-gray-200 rounded-xl shadow-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => navigateYear("prev")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Previous year"
                  >
                    <Rewind className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {monthYear}
                </h3>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Next month"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateYear("next")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Next year"
                  >
                    <FastForward className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Today button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={goToToday}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-sm font-medium text-gray-500 text-center py-3"
                    >
                      {day}
                    </div>
                  )
                )}

                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={day.isDisabled}
                    className={cn(
                      "h-10 w-10 text-sm rounded-lg flex items-center justify-center transition-all duration-200",
                      day.isCurrentMonth
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-gray-400",
                      day.isToday &&
                        "bg-blue-100 text-blue-900 font-semibold ring-2 ring-blue-200",
                      day.isSelected &&
                        "bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-lg",
                      day.isDisabled &&
                        "text-gray-300 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {day.date}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

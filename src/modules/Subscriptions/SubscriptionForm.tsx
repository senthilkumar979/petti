"use client";

import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { SelectOption } from "@/types";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { useCallback, useState } from "react";
import {
  CURRENCY_OPTIONS,
  PERIODICITY_OPTIONS,
  REMINDER_OPTIONS,
} from "../../app/data/SubscriptionOptions";
import Drawer from "../../components/molecules/Drawer";

interface SubscriptionFormProps {
  onSubmit: (
    data: Omit<
      Subscription,
      "id" | "lastModified" | "modifiedBy" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Subscription>;
  categories: SubscriptionCategory[];
  users: User[];
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  categories,
  users,
}) => {
  const [formData, setFormData] = useState({
    nameOfSubscription: initialData?.nameOfSubscription || "",
    periodicity: initialData?.periodicity || "Monthly",
    amount: initialData?.amount?.toString() || "",
    currency: initialData?.currency || "USD",
    renewalDate: initialData?.renewalDate
      ? new Date(initialData.renewalDate).toISOString().split("T")[0]
      : "",
    reminderOne: initialData?.reminderOne || "1 day before",
    reminderTwo: initialData?.reminderTwo || "2 days before",
    reminderThree: initialData?.reminderThree || "1 week before",
    category: initialData?.category || "",
    paidFor: initialData?.paidFor || users[0].id,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameOfSubscription.trim()) {
      newErrors.nameOfSubscription = "Subscription name is required";
    }

    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.renewalDate) {
      newErrors.renewalDate = "Renewal date is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.paidFor) {
      newErrors.paidFor = "Paid for is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        await onSubmit({
          nameOfSubscription: formData.nameOfSubscription.trim(),
          periodicity: formData.periodicity as Subscription["periodicity"],
          amount: Number(formData.amount),
          currency: formData.currency,
          renewalDate: formData.renewalDate,
          reminderOne: formData.reminderOne as Subscription["reminderOne"],
          reminderTwo: formData.reminderTwo as Subscription["reminderTwo"],
          reminderThree:
            formData.reminderThree as Subscription["reminderThree"],
          category: formData.category,
          paidFor: formData.paidFor,
        });
      } catch (error) {
        console.error("Error submitting subscription:", error);
      }
    },
    [formData, validateForm, onSubmit]
  );

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const userOptions: SelectOption[] = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Name */}
        <div className="md:col-span-2">
          <Input
            label="Subscription Name"
            value={formData.nameOfSubscription}
            onChange={(e) =>
              handleInputChange("nameOfSubscription", e.target.value)
            }
            placeholder="Enter subscription name"
            error={errors.nameOfSubscription}
            required
          />
        </div>

        {/* Periodicity */}
        <div>
          <Select
            label="Periodicity"
            value={formData.periodicity}
            onChange={(e) => handleInputChange("periodicity", e.target.value)}
            options={PERIODICITY_OPTIONS}
            error={errors.periodicity}
            required
          />
        </div>

        {/* Amount */}
        <div>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="0.00"
            error={errors.amount}
            required
          />
        </div>

        {/* Currency */}
        <div>
          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            options={CURRENCY_OPTIONS}
            error={errors.currency}
            required
          />
        </div>

        {/* Renewal Date */}
        <div>
          <Input
            label="Renewal Date"
            type="date"
            value={formData.renewalDate}
            onChange={(e) => handleInputChange("renewalDate", e.target.value)}
            error={errors.renewalDate}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            options={categoryOptions}
            placeholder="Select a category"
            error={errors.category}
            required
          />
        </div>

        {/* Paid For */}
        <div>
          <Select
            label="Paid For"
            value={formData.paidFor}
            onChange={(e) => handleInputChange("paidFor", e.target.value)}
            options={userOptions}
            placeholder="Select a user"
            error={errors.paidFor}
            required
          />
        </div>

        {/* Reminder One */}
        <div>
          <Select
            label="Reminder One"
            value={formData.reminderOne}
            onChange={(e) => handleInputChange("reminderOne", e.target.value)}
            options={REMINDER_OPTIONS}
            error={errors.reminderOne}
            required
          />
        </div>

        {/* Reminder Two */}
        <div>
          <Select
            label="Reminder Two"
            value={formData.reminderTwo}
            onChange={(e) => handleInputChange("reminderTwo", e.target.value)}
            options={REMINDER_OPTIONS}
            error={errors.reminderTwo}
            required
          />
        </div>

        {/* Reminder Three */}
        <div>
          <Select
            label="Reminder Three"
            value={formData.reminderThree}
            onChange={(e) => handleInputChange("reminderThree", e.target.value)}
            options={REMINDER_OPTIONS}
            error={errors.reminderThree}
            required
          />
        </div>
      </div>

      <Drawer.Action
        onClose={onCancel}
        onConfirm={() =>
          handleSubmit(new Event("submit") as unknown as React.FormEvent)
        }
        submitLabel={loading ? "Saving..." : "Save Subscription"}
        cancelLabel="Cancel"
      />
    </form>
  );
};

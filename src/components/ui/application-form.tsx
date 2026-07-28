"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { courses } from "@/data/courses";
import { getUtmAttribution } from "@/lib/utm";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { parseApiResponse } from "@/lib/api-response";

export const leadSourceOptions = [
  "Apply Now",
  "Enquire Now",
  "Book a Free Call",
] as const;
export type LeadSource = (typeof leadSourceOptions)[number];

const applicationSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(16, "Phone number is too long"),
  state: z.string().min(1, "Select your state"),
  program: z.string().min(1, "Select a program of interest"),
  qualification: z.string().min(2, "Enter your current qualification"),
  preferredUniversity: z.string().min(1, "Select your preferred university"),
  budget: z.string().min(1, "Select your total course budget"),
  customBudget: z.string(),
  preferredSession: z.string().min(1, "Select your preferred starting session"),
  customPreferredSession: z.string(),
  lastPassingPercentage: z
    .string()
    .trim()
    .regex(
      /^(100(?:\.0+)?|(?:\d{1,2})(?:\.\d+)?)$/,
      "Enter a percentage between 0 and 100",
    ),
  callbackDate: z.string().min(1, "Select a preferred callback date"),
  callbackTime: z.string().min(1, "Select a preferred callback time"),
}).superRefine((values, context) => {
  if (
    values.budget === "Custom amount" &&
    (!/^\d+$/.test(values.customBudget) || Number(values.customBudget) < 1000)
  ) {
    context.addIssue({
      code: "custom",
      path: ["customBudget"],
      message: "Enter a valid custom budget of at least ₹1,000",
    });
  }
  if (
    values.preferredSession === "Custom session" &&
    values.customPreferredSession.trim().length < 2
  ) {
    context.addIssue({
      code: "custom",
      path: ["customPreferredSession"],
      message: "Enter your preferred starting session",
    });
  }
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const programOptions = [
  { value: "", label: "Select a program" },
  ...courses
    .slice()
    .sort((left, right) => {
      const byUniversity = left.university.localeCompare(right.university);
      if (byUniversity !== 0) {
        return byUniversity;
      }
      return left.title.localeCompare(right.title);
    })
    .map((course) => ({
      value: course.id,
      label: `${course.title} - ${course.university}`,
    })),
];

export const universityOptions = [
  { value: "", label: "Select a university" },
  ...Array.from(new Set(courses.map((course) => course.university)))
    .sort((left, right) => left.localeCompare(right))
    .map((university) => ({ value: university, label: university })),
];

export const budgetOptions = [
  { value: "", label: "Select total course budget" },
  { value: "Below ₹50,000", label: "Below ₹50,000" },
  { value: "₹50,000 - ₹1,00,000", label: "₹50,000 - ₹1,00,000" },
  { value: "₹1,00,000 - ₹2,00,000", label: "₹1,00,000 - ₹2,00,000" },
  { value: "₹2,00,000 - ₹4,00,000", label: "₹2,00,000 - ₹4,00,000" },
  { value: "Above ₹4,00,000", label: "Above ₹4,00,000" },
  { value: "Custom amount", label: "Enter custom amount" },
  { value: "Need guidance", label: "Need guidance" },
];

export const sessionOptions = [
  { value: "", label: "Select starting session" },
  { value: "July 2026", label: "July 2026" },
  { value: "January 2027", label: "January 2027" },
  { value: "July 2027", label: "July 2027" },
  { value: "Custom session", label: "Enter custom session" },
  { value: "Not decided yet", label: "Not decided yet" },
];

export const callbackTimeOptions = [
  { value: "", label: "Select callback time" },
  { value: "9:00 AM - 12:00 PM", label: "9:00 AM - 12:00 PM" },
  { value: "12:00 PM - 3:00 PM", label: "12:00 PM - 3:00 PM" },
  { value: "3:00 PM - 6:00 PM", label: "3:00 PM - 6:00 PM" },
  { value: "6:00 PM - 8:00 PM", label: "6:00 PM - 8:00 PM" },
  { value: "Any time", label: "Any time" },
];

export const stateOptions = [
  { value: "", label: "Select your state" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "Delhi", label: "Delhi" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Puducherry", label: "Puducherry" },
];

const initialValues: ApplicationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  state: "",
  program: "",
  qualification: "",
  preferredUniversity: "",
  budget: "",
  customBudget: "",
  preferredSession: "",
  customPreferredSession: "",
  lastPassingPercentage: "",
  callbackDate: "",
  callbackTime: "",
};

type Status = "idle" | "success" | "error";

type ApplicationFormProps = {
  className?: string;
  leadSource: LeadSource;
  onSuccess?: () => void;
  resetSignal?: number;
};

export function ApplicationForm({
  className,
  leadSource,
  onSuccess,
  resetSignal = 0,
}: ApplicationFormProps) {
  const [form, setForm] = useState<ApplicationFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationFormValues, string>>
  >({});
  const [status, setStatus] = useState<Status>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialValues);
    setErrors({});
    setStatus("idle");
    setIsSubmitting(false);
    setRequestError(null);
    window.setTimeout(() => firstFieldRef.current?.focus(), 80);
  }, [leadSource, resetSignal]);

  const successMessage = useMemo(
    () =>
      "Application submitted successfully. An EduBh advisor will reach out within 24 hours.",
    [],
  );

  function handleChange<K extends keyof ApplicationFormValues>(
    key: K,
    value: ApplicationFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setRequestError(null);
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = applicationSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ApplicationFormValues;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setRequestError(null);
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...result.data,
          leadSource,
          utmAttribution: getUtmAttribution() ?? undefined,
        }),
      });

      const payload = await parseApiResponse<{
        success?: boolean;
        error?: string;
      }>(response);

      if (!response.ok || !payload.success) {
        setStatus("error");
        setRequestError(
          payload.error ?? "Please fix the highlighted fields before submitting again.",
        );
        return;
      }

      const selectedProgram =
        programOptions.find((option) => option.value === result.data.program)
          ?.label || result.data.program;
      trackMetaPixelEvent("Lead", {
        content_name: selectedProgram,
        content_category: "Course application",
      });
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setRequestError("Please fix the highlighted fields before submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mb-4 rounded-[1.3rem] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mb-4 rounded-[1.3rem] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700"
          >
            {requestError ?? "Please fix the highlighted fields before submitting again."}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="space-y-4"
      >
        <input type="hidden" name="leadSource" value={leadSource} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <input
              ref={firstFieldRef}
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              className="floating-input"
              placeholder="Full Name"
              disabled={isSubmitting}
            />
            <label htmlFor="fullName" className="floating-label">
              Full Name
            </label>
            {errors.fullName && (
              <p className="field-message text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="floating-field">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="floating-input"
              placeholder="Email"
              disabled={isSubmitting}
            />
            <label htmlFor="email" className="floating-label">
              Email
            </label>
            {errors.email && (
              <p className="field-message text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              className="floating-input"
              placeholder="Phone"
              disabled={isSubmitting}
            />
            <label htmlFor="phone" className="floating-label">
              Phone
            </label>
            {errors.phone && (
              <p className="field-message text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="floating-field">
            <select
              id="state"
              value={form.state}
              onChange={(event) => handleChange("state", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {stateOptions.map((option) => (
                <option key={option.value || "state-placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="state" className="floating-label">
              State
            </label>
            {errors.state && (
              <p className="field-message text-red-600">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <select
              id="program"
              value={form.program}
              onChange={(event) => handleChange("program", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {programOptions.map((option) => (
                <option key={option.value || "placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="program" className="floating-label">
              Which course are you interested in?
            </label>
            {errors.program && (
              <p className="field-message text-red-600">{errors.program}</p>
            )}
          </div>

          <div className="floating-field">
            <input
              id="qualification"
              type="text"
              value={form.qualification}
              onChange={(event) => handleChange("qualification", event.target.value)}
              className="floating-input"
              placeholder="Current Qualification"
              disabled={isSubmitting}
            />
            <label htmlFor="qualification" className="floating-label">
              Current Qualification
            </label>
            {errors.qualification && (
              <p className="field-message text-red-600">{errors.qualification}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <select
              id="preferredUniversity"
              value={form.preferredUniversity}
              onChange={(event) => handleChange("preferredUniversity", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {universityOptions.map((option) => (
                <option key={option.value || "university-placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="preferredUniversity" className="floating-label">
              What is your preferred university?
            </label>
            {errors.preferredUniversity && (
              <p className="field-message text-red-600">{errors.preferredUniversity}</p>
            )}
          </div>

          <div className="floating-field">
            <select
              id="budget"
              value={form.budget}
              onChange={(event) => handleChange("budget", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {budgetOptions.map((option) => (
                <option key={option.value || "budget-placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="budget" className="floating-label">
              What is your total course budget?
            </label>
            {errors.budget && (
              <p className="field-message text-red-600">{errors.budget}</p>
            )}
          </div>
        </div>
        {form.budget === "Custom amount" && (
          <div className="floating-field">
            <input
              id="customBudget"
              type="number"
              min="1000"
              step="1000"
              inputMode="numeric"
              value={form.customBudget}
              onChange={(event) => handleChange("customBudget", event.target.value)}
              className="floating-input"
              placeholder="Custom Budget Amount"
              disabled={isSubmitting}
            />
            <label htmlFor="customBudget" className="floating-label">
              Enter your total course budget (₹)
            </label>
            {errors.customBudget && (
              <p className="field-message text-red-600">{errors.customBudget}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <select
              id="preferredSession"
              value={form.preferredSession}
              onChange={(event) => handleChange("preferredSession", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {sessionOptions.map((option) => (
                <option key={option.value || "session-placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="preferredSession" className="floating-label">
              When would you like to start your course?
            </label>
            {errors.preferredSession && (
              <p className="field-message text-red-600">{errors.preferredSession}</p>
            )}
          </div>

          <div className="floating-field">
            <input
              id="lastPassingPercentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              inputMode="decimal"
              value={form.lastPassingPercentage}
              onChange={(event) => handleChange("lastPassingPercentage", event.target.value)}
              className="floating-input"
              placeholder="Last Passing Percentage"
              disabled={isSubmitting}
            />
            <label htmlFor="lastPassingPercentage" className="floating-label">
              What was your last passing percentage?
            </label>
            {errors.lastPassingPercentage && (
              <p className="field-message text-red-600">{errors.lastPassingPercentage}</p>
            )}
          </div>
        </div>
        {form.preferredSession === "Custom session" && (
          <div className="floating-field">
            <input
              id="customPreferredSession"
              type="text"
              value={form.customPreferredSession}
              onChange={(event) =>
                handleChange("customPreferredSession", event.target.value)
              }
              className="floating-input"
              placeholder="Preferred Starting Session"
              disabled={isSubmitting}
            />
            <label htmlFor="customPreferredSession" className="floating-label">
              Enter your preferred starting session
            </label>
            {errors.customPreferredSession && (
              <p className="field-message text-red-600">
                {errors.customPreferredSession}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="floating-field">
            <input
              id="callbackDate"
              type="date"
              value={form.callbackDate}
              onChange={(event) => handleChange("callbackDate", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            />
            <label htmlFor="callbackDate" className="floating-label">
              Preferred callback date
            </label>
            {errors.callbackDate && (
              <p className="field-message text-red-600">{errors.callbackDate}</p>
            )}
          </div>

          <div className="floating-field">
            <select
              id="callbackTime"
              value={form.callbackTime}
              onChange={(event) => handleChange("callbackTime", event.target.value)}
              className="floating-input"
              disabled={isSubmitting}
            >
              {callbackTimeOptions.map((option) => (
                <option key={option.value || "callback-placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="callbackTime" className="floating-label">
              Preferred callback or counselling time
            </label>
            {errors.callbackTime && (
              <p className="field-message text-red-600">{errors.callbackTime}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary w-full text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit application"
            )}
          </button>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
            By continuing, you agree to be contacted by EduBh advisors regarding
            your application.
          </p>
        </div>
      </motion.form>
    </div>
  );
}



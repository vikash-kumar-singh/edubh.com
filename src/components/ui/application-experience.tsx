"use client";

import { ApplicationForm, type LeadSource } from "@/components/ui/application-form";

type ApplicationExperienceProps = {
  leadSource: LeadSource;
  resetSignal?: number;
  containerClassName?: string;
  formWrapperClassName?: string;
};

export function ApplicationExperience({
  leadSource,
  resetSignal = 0,
  containerClassName,
  formWrapperClassName = "surface-card-strong p-6 sm:p-8 lg:p-10",
}: ApplicationExperienceProps) {
  return (
    <div className={containerClassName}>
      <section className="mx-auto w-full max-w-5xl space-y-8">
        <div className="space-y-5 px-1 sm:px-2">
          <div className="eyebrow">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Apply</span>
          </div>
          <div>
            <h1 className="display-title max-w-4xl text-balance text-[var(--foreground)]">
              One application.
              <br />
              <span className="text-gradient">Endless possibilities.</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Tell us about your aspirations. Our EduBh advisors will curate the
              perfect academic path for you across our seven partner universities.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="trust-pill">
              <strong>1</strong>
              <span>Unified application</span>
            </div>
            <div className="trust-pill">
              <strong>7</strong>
              <span>Partner universities</span>
            </div>
            <div className="trust-pill">
              <strong>24h</strong>
              <span>Advisor response window</span>
            </div>
          </div>
        </div>

        <div className={formWrapperClassName}>
          <div className="mx-auto max-w-4xl">
            <ApplicationForm leadSource={leadSource} resetSignal={resetSignal} />
          </div>
        </div>
      </section>
    </div>
  );
}


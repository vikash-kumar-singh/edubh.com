"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import type { PublicFeedback } from "@/lib/firebase-db";
import { parseApiResponse } from "@/lib/api-response";

type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar?: StaticImageData;
  submittedFeedback?: boolean;
};

const defaultTestimonials: TestimonialItem[] = [
 
];

const relationshipLabels: Record<PublicFeedback["relationship"], string> = {
  student: "Current student",
  alumni: "EduBh alumni",
  applicant: "Applicant",
  parent: "Parent",
  other: "EduBh community",
};

export function TestimonialsColumn() {
  const [fiveStarFeedback, setFiveStarFeedback] = useState<PublicFeedback[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeedback() {
      try {
        const response = await fetch("/api/feedback/featured", {
          signal: controller.signal,
        });
        const payload = await parseApiResponse<{
          success?: boolean;
          data?: PublicFeedback[];
        }>(response);

        if (response.ok && payload.success && payload.data) {
          setFiveStarFeedback(payload.data);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Unable to load five-star feedback:", error);
        }
      }
    }

    void loadFeedback();
    return () => controller.abort();
  }, []);

  const testimonials = useMemo<TestimonialItem[]>(() => {
    const submittedTestimonials = fiveStarFeedback.map((feedback) => ({
      id: "feedback-" + feedback.id,
      name: feedback.fullName,
      role:
        feedback.course?.trim() ||
        relationshipLabels[feedback.relationship] ||
        "EduBh learner",
      text: feedback.message,
      submittedFeedback: true,
    }));

    return [...submittedTestimonials, ...defaultTestimonials];
  }, [fiveStarFeedback]);

  const items = [...testimonials, ...testimonials];
  const animationDuration = Math.max(32, testimonials.length * 7);

  return (
    <section className="surface-card px-5 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Outcomes
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Love from EduBh alumni
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-[rgba(109,132,170,0.16)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">
            5-star student feedback appears here
          </div>
          <Link href="/feedback" className="button-ghost text-sm">
            Share feedback
          </Link>
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,246,252,0.86))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <motion.div
          className="flex h-max flex-col gap-4"
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((testimonial, index) => (
            <article
              key={testimonial.id + "-" + index}
              className="rounded-[1.55rem] border border-white/80 bg-white/92 p-4 shadow-[0_18px_32px_rgba(16,32,58,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-current"
                    />
                  ))}
                </div>
                {testimonial.submittedFeedback && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-700">
                    Student feedback
                  </span>
                )}
              </div>

              <p className="line-clamp-4 text-sm leading-7 text-[var(--foreground)]">
                {testimonial.text}
              </p>

              <div className="mt-4 flex items-center gap-3">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#165df5,#0d47c4)] text-sm font-bold uppercase text-white"
                  >
                    {testimonial.name.trim().charAt(0) || "E"}
                  </div>
                )}
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold text-[var(--foreground)]">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-[var(--muted)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f1f6fc] via-[#f1f6fc]/88 to-transparent" />
      </div>
    </section>
  );
}

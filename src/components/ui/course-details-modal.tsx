"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Download, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/data/courses";
import { trackMetaPixelCourseView } from "@/lib/meta-pixel";

type CourseDetailsModalProps = {
  course: Course | null;
  onClose: () => void;
};

export function CourseDetailsModal({ course, onClose }: CourseDetailsModalProps) {
  const lastTrackedCourse = useRef<string | null>(null);

  useEffect(() => {
    if (!course) {
      lastTrackedCourse.current = null;
      return;
    }

    if (lastTrackedCourse.current !== course.id) {
      trackMetaPixelCourseView(course, "course_modal");
      lastTrackedCourse.current = course.id;
    }
  }, [course]);

  useEffect(() => {
    if (!course) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [course, onClose]);

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,17,31,0.44)] px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="surface-card-strong relative w-full max-w-2xl p-6 text-sm text-[var(--foreground)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {course.university}
                </p>
                <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
                  {course.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(109,132,170,0.18)] bg-white text-[var(--muted)] shadow-[0_10px_24px_rgba(16,32,58,0.08)] transition-colors hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-[#eef3fa] px-3 py-1.5 text-[var(--foreground)]">
                {course.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef3fa] px-3 py-1.5 text-[var(--foreground)]">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </span>
            </div>

            <section className="max-h-[50vh] space-y-4 overflow-y-auto pr-1 text-sm leading-7 text-[var(--muted)]">
              <p>{course.description}</p>
              <div className="rounded-[1.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(22,93,245,0.08),rgba(255,255,255,0.9))] px-4 py-4">
                <p className="mb-2 font-semibold text-[var(--foreground)]">What to expect</p>
                <p>
                  Rigorous academics paired with mentor-led guidance, portfolio-ready
                  work, and personalised support from the EduBh counselling team.
                </p>
              </div>
              {course.brochures.length > 0 && (
                <div className="rounded-[1.4rem] border border-[rgba(109,132,170,0.16)] bg-white/90 px-4 py-4">
                  <p className="mb-3 font-semibold text-[var(--foreground)]">Course brochures</p>
                  <div className="space-y-3">
                    {course.brochures.map((brochure) => (
                      <div key={brochure.file} className="flex flex-col gap-3 rounded-[1rem] bg-[#f6f8fc] px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-medium text-[var(--foreground)]">{brochure.title}</span>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <a href={brochure.file} target="_blank" rel="noreferrer" data-meta-action="brochure_view" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-ghost inline-flex items-center gap-2 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </a>
                          <a href={brochure.file} download data-meta-action="brochure_download" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-ghost inline-flex items-center gap-2 text-xs">
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <footer className="mt-6 flex flex-col gap-4 border-t border-[rgba(109,132,170,0.14)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
                Secure your seat with a guided application through EduBh.
              </p>
              <Link href="/apply" data-meta-action="apply" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-primary text-sm">
                Apply now
              </Link>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



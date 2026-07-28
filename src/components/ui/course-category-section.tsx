"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";
import type { Course } from "@/data/courses";

type Props = { title: string; courses: Course[]; onSelect?: (course: Course) => void };
const PAGE_SIZE = 8;
const universityLogos: Record<string, string> = {
  "Lovely Professional University Online": "/universities/lpu-online.svg",
  "Dr. D. Y. Patil Vidyapeeth Online": "/universities/dy-patil-online.png",
  "ARKA JAIN University Online": "/universities/arka-jain-online-v2.png",
  "Manipal University": "/manipal.png",
  "Jain University": "/jain.png",
  "Sharda University Online": "/sharda.png",
  "Shoolini University Online": "/universities/shoolini-online.png",
};

export function CourseCategorySection({ title, courses, onSelect }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleCourses = courses.slice(0, visibleCount);
  const remaining = courses.length - visibleCourses.length;
  if (!courses.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{courses.length} program{courses.length > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleCourses.map((course) => (
          <article key={course.id} className="group relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/94 p-5 shadow-[0_18px_34px_rgba(16,32,58,0.08)] transition-transform duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(22,93,245,0.1),transparent_55%,rgba(31,199,182,0.12))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-between gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                  <div className="inline-flex max-w-full rounded-full border border-[rgba(109,132,170,0.16)] bg-[rgba(22,93,245,0.08)] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{course.university}</div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{course.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{course.description}</p>
                  </div>
                </div>
                <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-[1.35rem] bg-white/90 p-2 shadow-[0_8px_20px_rgba(16,32,58,0.08)]">
                  {universityLogos[course.university] && <Image src={universityLogos[course.university]} alt={course.university} width={112} height={64} unoptimized className="h-full w-full object-contain" />}
                </div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef3fa] px-3 py-1.5 text-[var(--foreground)]">{course.category}</span>
                  <span className="rounded-full bg-[#f6f8fc] px-3 py-1.5 text-[var(--muted)]">{course.duration}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {course.brochures[0] && <a href={course.brochures[0].file} download className="button-ghost inline-flex items-center gap-2 text-sm" aria-label={`Download ${course.brochures[0].title}`}><Download className="h-4 w-4" />Brochure</a>}
                  <button type="button" onClick={() => onSelect?.(course)} className="button-ghost text-sm">View details</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {courses.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {remaining > 0 && <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="button-secondary text-sm">Show {Math.min(PAGE_SIZE, remaining)} more</button>}
          {visibleCount > PAGE_SIZE && <button type="button" onClick={() => setVisibleCount(PAGE_SIZE)} className="button-ghost text-sm">Show less</button>}
        </div>
      )}
    </section>
  );
}



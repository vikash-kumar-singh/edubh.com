"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { courses, type Course } from "@/data/courses";
import { CourseDetailsModal } from "@/components/ui/course-details-modal";

export default function ManipalCoursesPage() {
  const manipalCourses = useMemo(
    () => courses.filter((course) => course.university === "Manipal University"),
    [],
  );
  const categories = useMemo(
    () => ["All Courses", ...Array.from(new Set(manipalCourses.map((course) => course.category)))],
    [manipalCourses],
  );

  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All Courses") {
      return manipalCourses;
    }
    return manipalCourses.filter((course) => course.category === selectedCategory);
  }, [manipalCourses, selectedCategory]);

  return (
    <div className="space-y-6">
      <section className="surface-card-strong overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div className="space-y-4">
            <div className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Manipal Online</span>
            </div>
            <h1 className="section-title">Manipal Online Courses</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              Explore the complete range of Manipal University programs.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="trust-pill">
              <strong>{manipalCourses.length}</strong>
              <span>Programs</span>
            </div>
            <div className="trust-pill">
              <strong>{categories.length - 1}</strong>
              <span>Categories</span>
            </div>
            <div className="trust-pill">
              <strong>1</strong>
              <span>Guided application</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface-card h-fit px-5 py-5 sm:px-6">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Categories
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-[1.2rem] px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-[linear-gradient(135deg,#165df5,#0d47c4)] text-white shadow-[0_12px_28px_rgba(22,93,245,0.22)]"
                      : "bg-white text-[var(--foreground)] shadow-[0_8px_18px_rgba(16,32,58,0.06)] hover:bg-[#eef3fa]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </aside>

        <motion.section
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredCourses.map((course) => (
            <motion.article
              key={course.id}
              layout
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/94 p-5 shadow-[0_18px_34px_rgba(16,32,58,0.08)]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(22,93,245,0.1),transparent_55%,rgba(31,199,182,0.12))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full border border-[rgba(109,132,170,0.16)] bg-[rgba(22,93,245,0.08)] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                      {course.category}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                      {course.title}
                    </h2>
                  </div>
                </div>
                <p className="line-clamp-3 text-sm leading-7 text-[var(--muted)]">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f6f8fc] px-3 py-1.5 text-sm text-[var(--muted)]">
                    {course.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    data-meta-action="course_details"
                    data-meta-course-id={course.id}
                    data-meta-course-title={course.title}
                    data-meta-university={course.university}
                    className="button-ghost text-sm"
                  >
                    View details
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.section>
      </div>

      <CourseDetailsModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}





import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = courses.find((entry) => entry.id === id);
  if (!course) {
    return {
      title: "Course not found - EduBh",
    };
  }

  return {
    title: `${course.title} at ${course.university} - EduBh`,
    description: course.description,
  };
}

export default async function CourseDetail({ params }: CoursePageProps) {
  const { id } = await params;
  const course = courses.find((entry) => entry.id === id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="surface-card-strong px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{course.university}</span>
            </div>
            <h1 className="section-title max-w-4xl text-balance">{course.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              {course.description}
            </p>
          </div>
          <Link href="/apply" data-meta-action="apply" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-primary w-fit text-sm sm:text-base">
            Apply Now
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.85fr)]">
        <section className="surface-card px-6 py-6 sm:px-7">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Program overview
          </h2>
          <div className="mt-5 space-y-5">
            <p className="text-base leading-8 text-[var(--foreground)]">
              {course.description}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(22,93,245,0.08),rgba(255,255,255,0.92))] p-4">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Duration
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {course.duration}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(31,199,182,0.08),rgba(255,255,255,0.92))] p-4">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Category
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {course.category}
                </p>
              </div>
            </div>
            <div className="rounded-[1.55rem] border border-white/70 bg-white/88 px-5 py-5 shadow-[0_16px_32px_rgba(16,32,58,0.06)]">
              <p className="mb-2 text-base font-semibold text-[var(--foreground)]">
                Eligibility
              </p>
              <p className="text-sm leading-7 text-[var(--muted)]">
                Undergraduate programs typically require 10+2 with a strong
                academic profile. Postgraduate programs require a relevant
                undergraduate degree. Final eligibility is confirmed by the
                university admissions team.
              </p>
            </div>
            {course.brochures.length > 0 && (
              <div className="rounded-[1.55rem] border border-[rgba(109,132,170,0.16)] bg-white/92 px-5 py-5 shadow-[0_16px_32px_rgba(16,32,58,0.06)]">
                <p className="mb-1 text-base font-semibold text-[var(--foreground)]">Course brochures</p>
                <p className="mb-4 text-sm leading-7 text-[var(--muted)]">
                  View the complete program details online or download the PDF for later.
                </p>
                <div className="space-y-3">
                  {course.brochures.map((brochure) => (
                    <div key={brochure.file} className="flex flex-col gap-3 rounded-[1.2rem] bg-[#f6f8fc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-medium text-[var(--foreground)]">{brochure.title}</span>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <a href={brochure.file} target="_blank" rel="noreferrer" data-meta-action="brochure_view" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-ghost inline-flex items-center gap-2 text-sm">
                          <ExternalLink className="h-4 w-4" /> View PDF
                        </a>
                        <a href={brochure.file} download data-meta-action="brochure_download" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="button-primary inline-flex items-center gap-2 text-sm">
                          <Download className="h-4 w-4" /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="surface-card-dark p-6">
            <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#93a8cc]">
              Program snapshot
            </h2>
            <dl className="mt-5 space-y-4 text-sm text-[#c6d2e8]">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <dt>University</dt>
                <dd className="text-right font-semibold text-white">{course.university}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <dt>Category</dt>
                <dd className="text-right font-semibold text-white">{course.category}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <dt>Duration</dt>
                <dd className="text-right font-semibold text-white">{course.duration}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt>Fees</dt>
                <dd className="text-right font-semibold text-white">
                  Shared during counselling
                </dd>
              </div>
            </dl>
            <Link href="/apply" data-meta-action="apply" data-meta-course-id={course.id} data-meta-course-title={course.title} data-meta-university={course.university} className="mt-6 button-primary w-full text-sm">
              Start application
            </Link>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="mb-2 text-base font-semibold text-[var(--foreground)]">
              How EduBh supports you
            </p>
            <ul className="space-y-2 text-sm leading-7 text-[var(--muted)]">
              <li>Profile evaluation and course fitment</li>
              <li>Application review and essay guidance</li>
              <li>Scholarship and financial planning support</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}


"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { LeadSource } from "@/components/ui/application-form";

const stats = [
  { value: "7", label: "Partner universities" },
  { value: "2000+", label: "Learners" },
  { value: "4.9/5", label: "Average satisfaction" },
];

type HeroProps = {
  onOpenApplicationModal: (leadSource: LeadSource) => void;
};

export function Hero({ onOpenApplicationModal }: HeroProps) {
  return (
    <section className="surface-card-strong relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[-10%] w-[42%] rounded-full bg-[radial-gradient(circle,rgba(22,93,245,0.22),transparent_62%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-12%] top-[-18%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(31,199,182,0.24),transparent_65%)] blur-3xl"
      />
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        <div className="space-y-7">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="eyebrow"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Admissions open for 2026 cohorts</span>
          </motion.div>

          <div className="space-y-5">
            <motion.h1
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.06, type: "spring", stiffness: 110 }}
              className="display-title max-w-4xl text-balance text-[var(--foreground)]"
            >
              <span className="text-gradient">EduBh</span> - Industry-Ready Education
            </motion.h1>
            <motion.p
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 110 }}
              className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg"
            >
              Curated programs from Manipal, Jain, and Sharda University Online,
              engineered with industry partners so you graduate with a portfolio,
              not just a degree.
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 110 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenApplicationModal("Apply Now")}
                className="button-primary text-sm sm:text-base"
              >
                Apply Now
                <span className="text-sm text-sky-100/90">Takes less than 3 minutes</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenApplicationModal("Book a Free Call")}
                className="button-secondary text-sm sm:text-base"
              >
                Book a Free Call
              </button>
            </div>
            <Link href="/courses" className="button-ghost text-sm sm:text-base">
              Browse all programs
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="stat-chip">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.6 }}
          className="relative"
        >
          <div className="surface-card radial-surface relative overflow-hidden p-5 sm:p-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-[1.6rem] border border-white/60 bg-white/76 p-4 shadow-[0_16px_36px_rgba(16,32,58,0.08)]">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Partnered Universities
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)] sm:text-base">
                    Manipal University
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)] sm:text-base">
                    Jain University
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)] sm:text-base">
                    Sharda University Online
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white px-3 py-2 shadow-[0_12px_24px_rgba(16,32,58,0.08)]">
                    <Image
                      src="/manipal.png"
                      alt="Manipal University"
                      width={88}
                      height={28}
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 shadow-[0_12px_24px_rgba(16,32,58,0.08)]">
                    <Image
                      src="/jain.png"
                      alt="Jain University"
                      width={88}
                      height={28}
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 shadow-[0_12px_24px_rgba(16,32,58,0.08)]">
                    <Image
                      src="/sharda.png"
                      alt="Sharda University Online"
                      width={88}
                      height={28}
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-[1.6rem] border border-white/60 bg-[linear-gradient(180deg,rgba(22,93,245,0.12),rgba(255,255,255,0.96))] p-4 shadow-[0_18px_36px_rgba(16,32,58,0.08)]"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Unified Application
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                    1
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    One application to access curated programs from Manipal,
                    Jain, and Sharda University Online.
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="surface-card-dark flex flex-col justify-between p-5"
                >
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#93a8cc]">
                      Outcomes
                    </p>
                    <p className="mt-3 text-4xl font-bold tracking-tight">4.9/5</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#c6d2e8]">
                    average satisfaction across 2000+ learners
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


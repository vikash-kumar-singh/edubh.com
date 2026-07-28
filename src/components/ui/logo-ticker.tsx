"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Manipal University", short: "Manipal", src: "/manipal.png" },
  { name: "Jain University", short: "Jain", src: "/jain.png" },
  { name: "Sharda University Online", short: "Sharda", src: "/sharda.png" },
  { name: "Lovely Professional University Online", short: "LPU Online", src: "/universities/lpu-online.svg" },
  { name: "ARKA JAIN University Online", short: "ARKA JAIN", src: "/universities/arka-jain-online-v2.png" },
  { name: "Dr. D. Y. Patil Vidyapeeth Online", short: "D. Y. Patil", src: "/universities/dy-patil-online.png" },
  { name: "Shoolini University Online", short: "Shoolini", src: "/universities/shoolini-online.png" },
];

export function LogoTicker() {
  const items = [...logos, ...logos, ...logos];

  return (
    <section className="surface-card px-5 py-5 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Trusted by leading universities
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Curated cohorts, small class sizes
          </h2>
        </div>
        <div className="rounded-full border border-[rgba(109,132,170,0.16)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">
          Admissions and advising designed for clarity
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/64 p-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />
        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((logo, index) => (
            <motion.div
              key={`${logo.name}-${index}`}
              whileHover={{ y: -4 }}
              className="group flex min-w-[220px] items-center gap-4 rounded-[1.45rem] border border-white/60 bg-white/92 px-5 py-4 shadow-[0_14px_28px_rgba(16,32,58,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(22,93,245,0.12),rgba(31,199,182,0.12))]">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {logo.short}
                </div>
                <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {logo.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/apply", label: "Apply" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[rgba(109,132,170,0.16)] bg-white/82 shadow-[0_18px_48px_rgba(16,32,58,0.08)] backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[82rem] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-[1.25rem] bg-white/80 p-1.5 shadow-[0_10px_26px_rgba(16,32,58,0.12)]">
            <Image
              src="/main.png"
              alt="EduBh"
              width={34}
              height={34}
              className="h-8 w-8 rounded-2xl object-contain"
            />
          </div>
          <div className="hidden min-[420px]:block">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[var(--muted)]">
              EduBh
            </p>
            <p className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Industry-Ready Education
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/58 p-1.5 shadow-[0_14px_32px_rgba(16,32,58,0.08)] backdrop-blur-xl md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[linear-gradient(135deg,#165df5,#0d47c4)] text-white shadow-[0_12px_28px_rgba(22,93,245,0.24)]"
                    : "text-[var(--foreground)] hover:bg-white/72"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <p className="max-w-xs text-right text-xs leading-relaxed text-[var(--muted)]">
            Partnering with <span className="font-semibold text-[var(--foreground)]">Manipal</span>,{" "}
            <span className="font-semibold text-[var(--foreground)]">Jain</span>, and{" "}
            <span className="font-semibold text-[var(--foreground)]">
              Sharda University Online
            </span>
          </p>
          <Link href="/enquire" className="button-primary px-5 py-3 text-sm">
            Enquire Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/apply" className="button-primary px-4 py-2.5 text-sm">
            Apply
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/72 text-[var(--foreground)] shadow-[0_10px_24px_rgba(16,32,58,0.08)] backdrop-blur-xl"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-[rgba(109,132,170,0.14)] bg-white/92 px-4 pb-4 pt-2 shadow-[0_16px_40px_rgba(16,32,58,0.08)] backdrop-blur-2xl md:hidden"
          >
            <nav className="surface-card grid gap-2 p-3">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[linear-gradient(135deg,#165df5,#0d47c4)] text-white"
                        : "bg-white/72 text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <p className="px-1 pt-2 text-xs leading-relaxed text-[var(--muted)]">
                Partnering with Manipal, Jain, and Sharda University Online
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


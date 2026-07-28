"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { offices } from "@/data/offices";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactForm>(
    key: K,
    value: ContactForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackMetaPixelEvent("Contact", {
      content_name: "General contact form",
    });
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <section className="surface-card-strong px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
          <div className="space-y-4">
            <div className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Contact</span>
            </div>
            <h1 className="section-title">Contact EduBh</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              Speak to an EduBh advisor about programs, eligibility, and the right
              path for your goals.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="trust-pill">
              <strong>Email</strong>
              <span>support@edubh.com</span>
            </div>
            <div className="trust-pill">
              <strong>Call</strong>
              <span>+91 8240501323</span>
            </div>
            <div className="trust-pill">
              <strong>Kolkata - Dum Dum Office</strong>
              <span>North Dum Dum, West Bengal-700080</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="surface-card-strong p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="floating-field">
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="floating-input"
                placeholder="Full Name"
              />
              <label htmlFor="name" className="floating-label">
                Full Name
              </label>
            </div>

            <div className="floating-field">
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                suppressHydrationWarning
                className="floating-input"
                placeholder="Email"
              />
              <label htmlFor="contact-email" className="floating-label">
                Email
              </label>
            </div>

            <div className="floating-field">
              <textarea
                id="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={5}
                className="floating-input resize-none"
                placeholder="Message"
              />
              <label htmlFor="message" className="floating-label">
                Message
              </label>
            </div>

            <div className="pt-2">
              <button type="submit" className="button-primary w-full text-sm sm:text-base">
                Send message
              </button>
              {submitted && (
                <p className="mt-3 rounded-[1.2rem] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                  Message received. Our team will respond within one working day.
                </p>
              )}
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="surface-card px-5 py-5 sm:px-6">
            <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Contact details
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-4 rounded-[1.4rem] bg-white/88 px-4 py-4 shadow-[0_12px_24px_rgba(16,32,58,0.06)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(22,93,245,0.1)] text-[var(--brand)]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Email</p>
                  <a
                    href="mailto:hello@edubh.in"
                    className="mt-1 inline-block text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    support@edubh.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 rounded-[1.4rem] bg-white/88 px-4 py-4 shadow-[0_12px_24px_rgba(16,32,58,0.06)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(22,93,245,0.1)] text-[var(--brand)]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Phone</p>
                  <a
                    href="tel:+918240501323"
                    className="mt-1 inline-block text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    +91 8240501323
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 rounded-[1.4rem] bg-white/88 px-4 py-4 shadow-[0_12px_24px_rgba(16,32,58,0.06)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(22,93,245,0.1)] text-[var(--brand)]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Address</p>
                  <p className="mt-1 text-[var(--muted)]">
                    EduBh, Kolkata - Dum Dum Office
                    <br />
                    Building India Post office, 2nd floor, Jessore Rd, K.B.Sarani, Dum Dum, North Dum Dum, West Bengal-700080
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <section className="surface-card px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Office Locations
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Find and visit any of our branches
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {offices.map((office) => (
                <article
                  key={office.slug}
                  className="flex items-start gap-3 rounded-lg border border-white/30 bg-white p-3 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {office.city} - {office.officeName}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {office.fullAddress}
                    </p>
                    <Link
                      href={`/contact/${office.slug}`}
                      className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:underline"
                    >
                      View Branch Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <FAQAccordion />
        </aside>
      </div>
    </div>
  );
}




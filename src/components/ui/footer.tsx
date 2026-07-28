import Image from "next/image";
import Link from "next/link";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import facebookPng from "@/assets/facebook.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#081326] px-4 py-14 text-sm text-[#c6d2e8] md:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(22,93,245,0.35),transparent_68%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(31,199,182,0.22),transparent_66%)] blur-3xl"
      />
      <div className="relative mx-auto flex max-w-[82rem] flex-col gap-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-[1.35rem] bg-white/10 p-2 shadow-[0_16px_36px_rgba(8,19,38,0.25)]">
                <Image
                  src="/main.png"
                  alt="EduBh"
                  width={34}
                  height={34}
                  className="h-8 w-8 rounded-2xl object-contain"
                />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#8ea0bf]">
                  EduBh
                </p>
                <span className="text-lg font-semibold tracking-tight text-white">
                  Industry-Ready Education
                </span>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#c6d2e8]">
              EduBh partners with leading universities like Manipal, Jain, and
              Sharda University Online to deliver industry-ready learning
              experiences.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <SocialX className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/edubh.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <SocialInsta className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/edubhofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <SocialLinkedIn className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/share/1B7B4tL4an/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <Image src={facebookPng} alt="Facebook" width={16} height={16} />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea0bf]">
                Programs
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/courses" className="transition hover:text-white">
                    Postgraduate programs
                  </Link>
                </li>
                <li>
                  <Link href="/courses?level=ug" className="transition hover:text-white">
                    Undergraduate programs
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="transition hover:text-white">
                    View all courses
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea0bf]">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@edubh.in" className="transition hover:text-white">
                    support@edubh.com
                  </a>
                </li>
                <li>
                  <a href="tel:+91824051323" className="transition hover:text-white">
                    +91 8240501323
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-white">
                    Contact support
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="transition hover:text-white">
                    Share feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea0bf]">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="transition hover:text-white">
                    Terms of use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-white">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea0bf]">
                Partners
              </h3>
              <ul className="space-y-3">
                <li>Manipal University</li>
                <li>Jain University</li>
                <li>Sharda University Online</li>
                <li>Arka Jain University Online</li>
                <li>Dr. D. Y. Patil Vidyapeeth Online</li>
                <li>Lovely Professional University Online</li>
                <li>Shoolini University Online</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#8ea0bf] md:flex-row md:items-center md:justify-between">
          <p>© 2025 EduBh</p>
          <p>EduBh. Bridging Academia and Industry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


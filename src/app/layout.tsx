import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import { SiteFooter } from "@/components/ui/footer";
import { SiteHeader } from "@/components/ui/site-header";
import { UtmTracker } from "@/components/utm-tracker";
import { MetaPixel } from "@/components/meta-pixel";

export const metadata: Metadata = {
  title: "EduBh - Industry-Ready Education",
  description:
    "EduBh connects ambitious learners with top universities like Manipal, Jain, and Sharda University Online through industry-ready programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <UtmTracker />
          <MetaPixel />
        </Suspense>
        <div className="site-shell min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-[-12rem] z-0 mx-auto h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(22,93,245,0.18),transparent_68%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-[-10rem] right-[-6rem] z-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(31,199,182,0.18),transparent_66%)] blur-3xl"
          />
          <SiteHeader />
          <div className="page-shell">
            <main className="section-stack">{children}</main>
          </div>
          <SiteFooter />
          <FloatingDock />
        </div>
      </body>
    </html>
  );
}






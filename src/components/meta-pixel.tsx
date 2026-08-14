"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { courses } from "@/data/courses";
import {
  initializeMetaPixel,
  trackMetaPixelCourseView,
  trackMetaPixelCustomEvent,
  trackMetaPixelEvent,
} from "@/lib/meta-pixel";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    if (!initializeMetaPixel(META_PIXEL_ID)) {
      return;
    }

    const pageKey = pathname + (queryString ? "?" + queryString : "");
    if (window.__edubhLastMetaPage === pageKey) {
      return;
    }

    trackMetaPixelEvent("PageView");
    window.__edubhLastMetaPage = pageKey;

    const courseMatch = pathname.match(/^\/courses\/([^/]+)$/);
    if (!courseMatch) {
      return;
    }

    const courseId = decodeURIComponent(courseMatch[1]);
    const course = courses.find((item) => item.id === courseId);
    const contentKey = "course_page:" + courseId + ":" + pageKey;

    if (course && window.__edubhLastMetaContent !== contentKey) {
      trackMetaPixelCourseView(course, "course_page");
      window.__edubhLastMetaContent = contentKey;
    }
  }, [pathname, queryString]);

  useEffect(() => {
    if (!initializeMetaPixel(META_PIXEL_ID)) {
      return;
    }

    const handleInteraction = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const interactive = event.target.closest<HTMLElement>(
        "a, button, [role='button']",
      );

      if (
        !interactive ||
        interactive.dataset.metaIgnore === "true" ||
        (interactive instanceof HTMLButtonElement && interactive.disabled)
      ) {
        return;
      }

      const anchor =
        interactive instanceof HTMLAnchorElement
          ? interactive
          : interactive.closest<HTMLAnchorElement>("a");
      const href = anchor?.getAttribute("href") || undefined;
      const label = (
        interactive.dataset.metaLabel ||
        interactive.getAttribute("aria-label") ||
        interactive.textContent ||
        "Unlabelled interaction"
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
      const action = interactive.dataset.metaAction;
      const courseId = interactive.dataset.metaCourseId;
      const courseTitle = interactive.dataset.metaCourseTitle;
      const university = interactive.dataset.metaUniversity;
      const context = {
        button_text: label,
        element_type: interactive.tagName.toLowerCase(),
        link_url: href,
        page_path: window.location.pathname,
        content_ids: courseId ? [courseId] : undefined,
        content_name: courseTitle,
        university,
      };

      trackMetaPixelCustomEvent("ButtonClick", context);

      const isPdf = Boolean(href?.toLowerCase().includes(".pdf"));
      if (
        action === "brochure_download" ||
        (isPdf &&
          (anchor?.hasAttribute("download") ||
            /download|brochure/i.test(label)))
      ) {
        trackMetaPixelCustomEvent("BrochureDownload", context);
        return;
      }

      if (action === "brochure_view") {
        trackMetaPixelCustomEvent("BrochureView", context);
        return;
      }

      if (action === "course_details") {
        trackMetaPixelCustomEvent("CourseDetailsClick", context);
        return;
      }

      if (
        action === "apply" ||
        action === "enquire" ||
        action === "callback" ||
        /apply now|enquire now|book a free call/i.test(label)
      ) {
        trackMetaPixelCustomEvent("CTAButtonClick", {
          ...context,
          cta_action: action || "cta",
        });
        return;
      }

      if (
        href?.startsWith("tel:") ||
        href?.startsWith("mailto:") ||
        /wa\.me|whatsapp/i.test(href || "")
      ) {
        trackMetaPixelEvent("Contact", context);
      }
    };

    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, []);

  return null;
}
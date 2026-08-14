export type MetaPixelParameters = Record<
  string,
  | string
  | number
  | boolean
  | readonly string[]
  | readonly number[]
  | undefined
>;

export type MetaPixelCourse = {
  id: string;
  title: string;
  category: string;
  university: string;
};

type MetaPixelFunction = {
  (...argumentsList: unknown[]): void;
  callMethod?: (...argumentsList: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push?: MetaPixelFunction;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __edubhMetaPixelId?: string;
    __edubhLastMetaPage?: string;
    __edubhLastMetaContent?: string;
  }
}

export const initializeMetaPixel = (pixelId: string) => {
  if (typeof window === "undefined" || !pixelId) {
    return false;
  }

  if (!window.fbq) {
    const pixelFunction = function (...argumentsList: unknown[]) {
      if (pixelFunction.callMethod) {
        pixelFunction.callMethod(...argumentsList);
      } else {
        pixelFunction.queue.push(argumentsList);
      }
    } as MetaPixelFunction;

    pixelFunction.push = pixelFunction;
    pixelFunction.loaded = true;
    pixelFunction.version = "2.0";
    pixelFunction.queue = [];

    window.fbq = pixelFunction;
    window._fbq = pixelFunction;

    if (!document.getElementById("meta-pixel-script")) {
      const script = document.createElement("script");
      script.id = "meta-pixel-script";
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }
  }

  if (window.__edubhMetaPixelId !== pixelId) {
    window.fbq("init", pixelId);
    window.__edubhMetaPixelId = pixelId;
  }

  return true;
};

export const trackMetaPixelEvent = (
  eventName: string,
  parameters?: MetaPixelParameters,
) => {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  window.fbq("track", eventName, parameters || {});
};

export const trackMetaPixelCustomEvent = (
  eventName: string,
  parameters?: MetaPixelParameters,
) => {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  window.fbq("trackCustom", eventName, parameters || {});
};

export const trackMetaPixelCourseView = (
  course: MetaPixelCourse,
  contentLocation: "course_page" | "course_modal",
) => {
  trackMetaPixelEvent("ViewContent", {
    content_ids: [course.id],
    content_name: course.title,
    content_category: course.category,
    content_type: "product",
    university: course.university,
    content_location: contentLocation,
  });
};
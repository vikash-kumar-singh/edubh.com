"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtmAttribution } from "@/lib/utm";

export function UtmTracker() {
  useEffect(() => {
    captureUtmAttribution();
  }, []);

  return null;
}



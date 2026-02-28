"use client";

import { useEffect } from "react";

export default function BufferPolyfill() {
  useEffect(() => {
    if (!("Buffer" in window)) {
      import("buffer").then(({ Buffer }) => {
        Object.assign(window, { Buffer });
      });
    }
  }, []);

  return null;
}

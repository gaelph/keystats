import type React from "react";
import { useCallback, useEffect, useState } from "react";

export default function useClickOutside(
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: (event: MouseEvent) => void,
  deps: unknown[],
): () => void {
  const [enabled, setEnabled] = useState(false);
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      let parent = event.target as HTMLElement | null;

      while (parent && parent.tagName.toLowerCase() !== "body") {
        parent = parent.parentElement;
        if (parent === ref.current) {
          return;
        }
      }

      callback(event);
    },
    [callback, ...deps],
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside, enabled]);

  return useCallback(() => {
    if (!enabled) setEnabled(true);
    else setEnabled(false);
  }, []);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { useEffect } from "react";

interface KeySpecification {
  key: string | null;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type KeyBindings = Record<string, Function>;

function keyStringFromSpecification(keySpec: KeySpecification): string | null {
  if (keySpec.key === null) {
    return null;
  }

  const parts: string[] = [];
  if (keySpec.ctrlKey) parts.push("C");
  if (keySpec.metaKey) parts.push("D");
  if (keySpec.altKey) parts.push("A");
  if (keySpec.shiftKey) parts.push("S");
  parts.push(keySpec.key.toUpperCase());

  return `${parts.join("-")}`;
}

function normalizeKeys(keyString: string): string | null {
  const parts = keyString.split("-");
  if (parts.length === 0 || parts.length > 5) {
    throw new Error(`Invalid key string: ${keyString}`);
  }

  const key = parts.pop();
  const spec: KeySpecification = parts.reduce(
    (acc: KeySpecification, currentValue): KeySpecification => {
      switch (currentValue) {
        case "C":
          acc.ctrlKey = true;
          break;
        case "D":
          acc.metaKey = true;
          break;
        case "A":
          acc.altKey = true;
          break;
        case "S":
          acc.shiftKey = true;
          break;
      }

      return acc;
    },
    {
      key: key,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as KeySpecification,
  );

  return keyStringFromSpecification(spec);
}

function normalizeKeyBindings(keyBindings: KeyBindings): KeyBindings {
  return Object.fromEntries(
    Object.entries(keyBindings).map(([key, handler]: [string, Function]) => [
      normalizeKeys(key),
      handler,
    ]),
  );
}

export default function useKeybindings(
  keyBindings: KeyBindings,
): (...args: any[]) => (event: React.KeyboardEvent<HTMLElement>) => void {
  const bindings = normalizeKeyBindings(keyBindings);
  //
  return (...args: any[]) => {
    return (event: React.KeyboardEvent<HTMLElement>) => {
      const keyString = keyStringFromSpecification(event);
      if (keyString && bindings[keyString]) {
        bindings[keyString](...args);
      }
    };
  };
}

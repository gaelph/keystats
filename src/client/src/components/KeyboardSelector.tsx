import React, { useState, useCallback, useRef, useEffect } from "react";
import { Keyboard } from "~/lib/api.js";

import * as classes from "./KeyboardSelector.module.css";

interface KeyboardSelectorProps {
  selectedKeyboard: Keyboard | null;
  keyboards: Keyboard[];
  onChange: (keyboard: Keyboard) => void;
}

export default function KeyboardSelector({
  selectedKeyboard,
  keyboards,
  onChange,
}: KeyboardSelectorProps): React.ReactElement<KeyboardSelectorProps> {
  const self = useRef<HTMLDivElement | null>(null);
  const kMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const options = useRef<Array<HTMLDivElement>>([]);
  const [visible, setVisible] = useState(false);

  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      const item = self.current?.querySelector(
        "[role='menuitem']:not([tabindex='-1'])",
      );
      item?.focus();
      setHovered(selectedKeyboard?.id || null);
    }
  }, [selectedKeyboard, visible]);

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log(event);
      event.preventDefault();
      event.stopPropagation();
      const el = event.target as HTMLDivElement;
      const kb = keyboards.find((kb) => kb.id === hovered);
      const index = keyboards.indexOf(kb);
      const item = self.current?.querySelector(
        "[role='menuitem']:not([tabindex='-1'])",
      );

      switch (event.key) {
        case "ArrowDown":
        case "j":
        case "n":
          if (index + 1 < keyboards.length) {
            setHovered(keyboards[index + 1].id);
          }
          break;
        case "ArrowUp":
        case "k":
        case "e":
          if (index - 1 >= 0) {
            setHovered(keyboards[index - 1].id);
          }
          break;
        case "Tab":
          if (event.shiftKey) {
            if (index - 1 >= 0) {
              setHovered(keyboards[index - 1].id);
              options.current?.[index - 1]?.focus();
            }
          } else {
            if (index + 1 < keyboards.length) {
              setHovered(keyboards[index + 1].id);
              options.current?.[index + 1]?.focus();
            }
          }
          break;
        case "Enter":
          onChange(keyboards[index]);
          setVisible(false);
          break;

        case " ":
          setVisible(true);
          item?.focus();
          break;

        case "Escape":
          setVisible(false);
          el?.blur();
      }
    },
    [visible, keyboards, hovered],
  );

  const menuItemOnKeyUp = useCallback(
    (kb: Keyboard) => {
      return (event: React.KeyboardEvent<HTMLDivElement>) => {
        console.log("MI PRESS", event);
        event.preventDefault();
        event.stopPropagation();
        switch (event.key) {
          case " ":
          case "Enter":
            onChange(kb);
        }
      };
    },
    [onChange],
  );

  return (
    <button
      ref={self}
      className={classes.keyboardSelector}
      tabIndex={0}
      role="listbox"
      onClick={(e) => {
        if (e.target.getAttribute("role") !== "menuitem") {
          setVisible(true);
          // self.current?.focus();
          const item = self.current?.querySelector(
            "[role='menuitem']:not([tabindex='-1'])",
          );
          item?.focus();
        }
      }}
      onKeyUp={onKeyUp}
      onBlur={(e) => {
        if (e.relatedTarget?.getAttribute("role") !== "menuitem") {
          setVisible(false);
        }
      }}
    >
      <div className={classes.container}>
        <div role="button">
          {selectedKeyboard ? <h1>{selectedKeyboard.name}</h1> : <h1>---</h1>}
          <span className="material-symbols-sharp">keyboard_arrow_down</span>
        </div>
        <div role="menu" aria-hidden={!visible}>
          {keyboards.map((kb, index) => (
            <button
              ref={(el) => {
                if (el) {
                  options.current[index] = el;
                }
              }}
              key={`kb-selector-option-${kb.id}`}
              tabIndex={selectedKeyboard?.id === kb.id ? -1 : 0}
              role="menuitem"
              aria-selected={selectedKeyboard?.id === kb.id}
              className={`${kb.id === hovered ? classes.hover : ""}`}
              onMouseEnter={() => {
                setHovered(kb.id);
              }}
              onMouseOut={() => {
                setHovered(selectedKeyboard?.id);
              }}
              onClick={() => {
                onChange(kb);
                setVisible(false);
              }}
              onKeyUp={menuItemOnKeyUp(kb)}
            >
              {kb.name}
            </button>
          ))}
        </div>
      </div>
    </button>
  );
}

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
      setHovered(selectedKeyboard?.id || null);
    }
  }, [selectedKeyboard, visible]);

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const el = event.target as HTMLDivElement;
      const kb = keyboards.find((kb) => kb.id === hovered);
      const index = keyboards.indexOf(kb);

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
        case "Enter":
          onChange(keyboards[index]);
          setVisible(false);
          el?.blur();
          break;

        case "Escape":
          setVisible(false);
          el?.blur();
      }
    },
    [visible, keyboards, hovered],
  );

  return (
    <button
      ref={self}
      className={classes.keyboardSelector}
      tabIndex={0}
      role="listbox"
      onClick={() => {
        setVisible(true);
        self.current?.focus();
      }}
      onKeyUp={onKeyUp}
      onBlur={() => setVisible(false)}
    >
      <div className={classes.container}>
        <div className={classes.select}>
          {selectedKeyboard ? <h1>{selectedKeyboard.name}</h1> : <h1>---</h1>}
          <span className="material-symbols-sharp">keyboard_arrow_down</span>
        </div>
        <div className={classes.options} aria-hidden={!visible}>
          {keyboards.map((kb, index) => (
            <div
              ref={(el) => {
                if (el) {
                  kMap.current.set(kb.id, el);
                  options.current[index] = el;
                } else if (kMap.current.has(kb.id)) {
                  kMap.current.delete(kb.id);
                }
              }}
              key={`kb-selector-option-${kb.id}`}
              tabIndex={-1}
              role="option"
              aria-selected={selectedKeyboard?.id === kb.id}
              className={`${classes.option} ${
                selectedKeyboard?.id === kb.id ? classes.selected : ""
              } ${kb.id === hovered ? classes.hover : ""}`}
              onMouseEnter={() => {
                setHovered(kb.id);
              }}
              onMouseOut={() => {
                setHovered(selectedKeyboard?.id);
              }}
              onClick={() => {
                onChange(kb);
                const el = document.activeElement as HTMLElement | null;
                el?.blur();
              }}
            >
              {kb.name}
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

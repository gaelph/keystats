import React, { useState, useCallback, useRef } from "react";
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
  const [visible, setVisible] = useState(false);

  return (
    <div
      ref={self}
      className={classes.keyboardSelector}
      tabIndex={0}
      role="listbox"
      onClick={() => {
        setVisible(true);
      }}
      onBlur={() => setVisible(false)}
    >
      <div className={classes.container}>
        <div className={classes.select}>
          {selectedKeyboard ? <h1>{selectedKeyboard.name}</h1> : <h1>---</h1>}
          <span className="material-symbols-sharp">keyboard_arrow_down</span>
        </div>
        <div className={classes.options} aria-hidden={!visible}>
          {keyboards.map((kb) => (
            <div
              key={`kb-selector-option-${kb.id}`}
              tabIndex={0}
              role="option"
              aria-selected={selectedKeyboard?.id === kb.id}
              className={`${classes.option} ${
                selectedKeyboard?.id === kb.id ? classes.selected : ""
              }`}
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
    </div>
  );
}

import React, { useState, useCallback } from "react";
import { Keyboard } from "~/lib/api.js";

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
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="keyboard-selector"
      tabIndex={0}
      role="listbox"
      onClick={() => {
        setVisible(true);
      }}
      onBlur={() => setVisible(false)}
    >
      <div className="container">
        <div className="button select">
          {selectedKeyboard ? <h1>{selectedKeyboard.name}</h1> : <h1>---</h1>}
          <span className="material-symbols-sharp">keyboard_arrow_down</span>
        </div>
        <div className="options" aria-hidden={!visible}>
          {keyboards.map((kb) => (
            <div
              tabIndex={-1}
              role="option"
              aria-selected={selectedKeyboard?.id === kb.id}
              className={`option ${
                selectedKeyboard?.id === kb.id ? "selected" : ""
              }`}
              onClick={() => onChange(kb)}
            >
              {kb.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

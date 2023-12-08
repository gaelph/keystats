import React, { useCallback, useRef, useEffect } from "react";
import useClickOutside from "~/hooks/useClickOutside.js";
import useKeybindings from "~/hooks/useKeybindings.js";
import useKeyboardPicker from "~/hooks/useKeyboardPicker.js";
import { Keyboard } from "~/lib/api.js";

import * as classes from "./KeyboardSelector.module.css";

import KeyboardArrowDown from "@material-symbols/svg-400/sharp/keyboard_arrow_down.svg";

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
  const button = useRef<HTMLButtonElement | null>(null);
  const { opened, open, close } = useKeyboardPicker();

  // For accessibility, the first available option must focus on open
  useEffect(() => {
    if (opened) {
      const item = self.current?.querySelector<HTMLElement>(
        "[role='menuitem']:not([tabindex='-1'])",
      );
      item?.focus();
    } else {
      button.current?.focus();
    }
  }, [opened]);

  // Close the menu when clicking outside
  const toggleClickOutside = useClickOutside(self, close, [close]);

  // User Input Handlers
  const handleButtonClick = useCallback(() => {
    opened ? close() : open();
    toggleClickOutside();
  }, [open, opened, close, toggleClickOutside]);

  const handleUserSelection = useCallback(
    (kb: Keyboard) => {
      onChange(kb);
      close();
    },
    [close, onChange],
  );

  const keyHandler = useKeybindings({
    " ": handleUserSelection,
    Enter: handleUserSelection,
    Escape: close,
  });

  return (
    <div ref={self} className={classes.keyboardSelector} role="listbox">
      <div className={classes.container}>
        <button
          ref={button}
          role="button"
          onClick={handleButtonClick}
          aria-haspopup="menu"
        >
          {selectedKeyboard ? <h1>{selectedKeyboard.name}</h1> : <h1>---</h1>}
          <KeyboardArrowDown />
        </button>
        <div role="menu" aria-hidden={!opened}>
          {keyboards.map((kb) => (
            <button
              key={`kb-selector-option-${kb.id}`}
              tabIndex={selectedKeyboard?.id === kb.id ? -1 : 0}
              aria-disabled={selectedKeyboard?.id === kb.id}
              role="menuitem"
              aria-selected={selectedKeyboard?.id === kb.id}
              onClick={() => handleUserSelection(kb)}
              onKeyUp={keyHandler(kb)}
            >
              {kb.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

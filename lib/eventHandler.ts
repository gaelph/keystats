import { EventEmitter } from "events";
import log from "loglevel";

// @ts-ignore
import * as Keycodes from "../lib/keycodes.js";

import HIDEvent from "../hid/HIDEvent.js";
import { KeymapType } from "../service/models/keymap.js";

interface KeyDown {
  keycode: number;
  mods: number;
  col: number;
  row: number;
  layer: number;
  since: number;
}

const TAP_TERM = 250; // milliseconds

/**
 * Handles key event
 */
export default class KeyHandler extends EventEmitter {
  #logger = log.getLogger("KeyHandler");
  #keysDown: KeyDown[] = [];
  #currentLeftHandCount = 0;
  #currentRightHandCount = 0;
  #lastHandUsed: null | "left" | "right" = null;
  #currentFingerCount = 0;
  #lastFingerUsed = -1;

  constructor() {
    super();

    // this.#logger.disableAll();
  }

  emitPlain(
    keycode: number,
    mods: number,
    col: number,
    row: number,
    layer: number,
  ) {
    const [base, _type, _alter] = Keycodes.getEncodedKeycode(
      keycode.toString(16),
    );

    this.emit("key", {
      keycode: base,
      mods,
      col,
      row,
      layer,
      type: KeymapType.Plain,
    });
  }

  emitNonPlain(keycode: number, col: number, row: number, layer: number) {
    const [_base, type, alter] = Keycodes.getEncodedKeycode(
      keycode.toString(16),
    );

    this.emit("key", {
      keycode: alter,
      type,
      col,
      row,
      layer,
    });
  }

  handleHIDEvent(event: HIDEvent) {
    const { keycode, col, row, mods, layer, pressed } = event;

    // For the moment, we only care about keypresses
    if (pressed) {
      this.#keysDown.push({
        keycode,
        mods,
        col,
        row,
        layer,
        since: performance.now(),
      });

      this.#logger.debug(
        `KEY PRESS: ${keycode.toString(16)} | ${mods.toString(
          16,
        )} | col ${col} | row ${row} | layer ${layer} | keys down: ${
          this.#keysDown.length
        } `,
      );
    } else {
      const idx = this.#keysDown.findIndex(
        ({ keycode }) => keycode === keycode,
      );
      const pressedState = this.#keysDown[idx];
      this.#keysDown.splice(idx, 1);

      let timePressed = 249;
      if (pressedState) {
        timePressed = performance.now() - pressedState.since;
      } else {
        this.#logger.warn("Key not found", keycode.toString(16), mods, layer);
      }

      this.#logger.debug(
        `KEY RELEASE: ${keycode.toString(16)} | ${mods.toString(
          16,
        )} | mods ${mods.toString(
          2,
        )} | col ${col} | row ${row} | layer ${layer} ${
          pressedState.layer
        } | keys down: ${
          this.#keysDown.length
        } | time pressed: ${timePressed} ms`,
      );

      // if it is modTap, we want to wait for its release before counting it
      if (
        Keycodes.isModTap(keycode) &&
        !Keycodes.isLayerTap(keycode) &&
        !Keycodes.isCustomKeycode(keycode)
      ) {
        const released = Keycodes.getBasicFromModTap(keycode);
        const tapModifier = Keycodes.getModifierFromModTap(keycode);

        this.#logger.debug(
          "MOD TAP RELEASE: ",
          tapModifier.toString(16),
          released.toString(16),
        );

        // The mod tap key was pressed alone, so it is the basic keycode
        // we are interested in
        if (timePressed < TAP_TERM) {
          this.emitPlain(
            released,
            // ensure we don't count it as Mod+letter combination
            Keycodes.removeModifierFromBitfield(mods, tapModifier),
            col,
            row,
            layer,
          );

          this.#logger.debug(
            "COUNT A SINGLE KEY: ",
            mods.toString(2).padStart(8, "0"),
            released.toString(16),
          );
        } else {
          this.emitNonPlain(keycode, col, row, layer);
        }
      } else if (
        Keycodes.isLayerTap(keycode) &&
        !Keycodes.isCustomKeycode(keycode)
      ) {
        const released = Keycodes.getBasicFromModTap(keycode);
        const tapLayer = Keycodes.getLayerFromLayerTap(keycode);

        this.#logger.debug(
          "LAYER TAP RELEASE: ",
          tapLayer.toString(10),
          released.toString(16),
        );

        if (timePressed < TAP_TERM) {
          this.emitPlain(keycode, mods, col, row, pressedState.layer);
          this.#logger.debug(
            "COUNT A SINGLE KEY: ",
            released.toString(16),
            mods.toString(2).padStart(8, "0"),
            pressedState.layer,
          );
        } else {
          this.emitNonPlain(keycode, col, row, tapLayer);
        }
      } else {
        this.emitPlain(keycode, mods, col, row, layer);
      }
    }
  }
}

import KeyboardRepo from "./repository/keyboardRepo.js";
import HandService from "./handService.js";
import FingerService from "./fingerService.js";
import KeymapService from "./keymapService.js";

import Keyboard from "./models/keyboard.js";

import type HIDKeyboard from "../hid/HIDKeyboard.js";
import KeyHandler from "../lib/eventHandler.js";

import log from "loglevel";
import RecordService from "./recordService.js";
import Keymap, { KeymapType } from "./models/keymap.js";
import KeysService from "./keysService.js";
import { Coordinates } from "./types.js";
import { formatKeyCode } from "../lib/formatKeycodes.js";

interface CreateKeyboardPayload {
  name: string;
  vendorId: number;
  productId: number;
  fingerMap: number[][];
}

export type KeymapLayers = ({ character: string } & Pick<
  Keymap,
  "keycode" | "type"
>)[][][][];

export default class KeyboardService {
  #keyboardRepo: KeyboardRepo;
  //
  #fingerService: FingerService;
  #handService: HandService;
  #recordService: RecordService;
  #keymapService: KeymapService;
  #keysService: KeysService;
  // TODO: Maybe this shoulb be part of KeyboardService
  #keyHandler: KeyHandler;

  #keyboardId: number = 0;

  #logger = log.getLogger("KeyboardService");

  constructor(
    recordService?: RecordService,
    handService?: HandService,
    fingerService?: FingerService,
    keymapService?: KeymapService,
    keysService?: KeysService,
    keyHandler?: KeyHandler,
  ) {
    this.#keyboardRepo = new KeyboardRepo();
    this.#recordService = recordService || new RecordService();
    this.#handService = handService || new HandService();
    this.#fingerService = fingerService || new FingerService();
    this.#keymapService = keymapService || new KeymapService();
    this.#keysService = keysService || new KeysService();
    this.#keyHandler = keyHandler || new KeyHandler();
  }

  async createKeyboard({
    name,
    vendorId,
    productId,
    fingerMap,
  }: CreateKeyboardPayload): Promise<Keyboard | null> {
    try {
      const keyboard = await this.#keyboardRepo.create({
        name,
        vendorId,
        productId,
      });

      keyboard.keys = await this.#keysService.createKeysWithLayout(
        keyboard.id!,
        fingerMap,
      );

      return keyboard;
    } catch (err) {
      this.#logger.error(err);
      return null;
    }
  }

  async listKeyboards(): Promise<Keyboard[]> {
    try {
      return this.#keyboardRepo.getAll();
    } catch (err) {
      this.#logger.error(err);
    }

    return [];
  }

  async getKeyboard(keyboardId: number): Promise<Keyboard | null> {
    try {
      return this.#keyboardRepo.getById(keyboardId);
    } catch (error: unknown) {
      this.#logger.error(error);

      return null;
    }
  }

  async getKeymap(keyboard: Keyboard): Promise<KeymapLayers> {
    try {
      const layerMap = await this.#keymapService.getKeyboardKeymaps(keyboard);
      if (!layerMap) {
        return [];
      }

      const layers: KeymapLayers = [];

      for (const [layer, keymaps] of layerMap.entries()) {
        if (!layers[layer]) {
          layers[layer] = [];
        }
        for (const keymap of keymaps) {
          if (!layers[layer][keymap.row]) {
            layers[layer][keymap.row] = [];
          }
          if (!layers[layer][keymap.row][keymap.column]) {
            layers[layer][keymap.row][keymap.column] = [];
          }

          const character = formatKeyCode(keymap.keycode);
          layers[layer][keymap.row][keymap.column].push({
            keycode: keymap.keycode,
            character: character,
            type: keymap.type,
          });
        }
      }

      return layers;
    } catch (err) {
      this.#logger.error(err);
    }

    return [];
  }

  async saveKeyboardKeymap(
    keyboard: Keyboard,
    keymap: string[][][],
  ): Promise<Keyboard | null> {
    let keyboardId = 0;
    if (keyboard instanceof Keyboard && keyboard.id) {
      keyboardId = keyboard.id;
    } else {
      throw new Error("Invalid keyboard id");
    }

    try {
      await Promise.all(
        keymap.map(async (layout, index) => {
          const layer = await this.#keymapService.createLayerMapping(
            keyboardId,
            index,
            layout,
          );
          if (!layer) return null;

          return layer;
        }),
      );

      return keyboard;
    } catch (err) {
      this.#logger.error(err);
      return null;
    }
  }

  async addKeyboardRecord(params: {
    keycode: string;
    type: KeymapType;
    modifiers?: number;
    coordinates: Coordinates;
  }) {
    this.#logger.debug("Adding keyboard record", params);
    try {
      this.#recordService.addRecord(
        this.#keyboardId,
        params.coordinates,
        params.keycode,
        params.modifiers || 0,
        params.type,
      );
    } catch (error) {
      this.#logger.error("Failed to add keyboard record", error);
    }

    try {
      this.#handService.incrementHandUsage(
        this.#keyboardId,
        params.coordinates.column,
        params.coordinates.row,
      );
    } catch (error) {
      this.#logger.error("Failed to increment hand usage", error);
    }

    try {
      this.#fingerService.incrementFingerUsage(
        this.#keyboardId,
        params.coordinates.column,
        params.coordinates.row,
      );
    } catch (error) {
      this.#logger.error("Failed to increment finger usage", error);
    }
  }

  async handleKeyboard(hidKeyboard: HIDKeyboard) {
    hidKeyboard.on(
      "event",
      this.#keyHandler.handleHIDEvent.bind(this.#keyHandler),
    );

    this.#keyHandler.on("key", (event) => {
      this.#logger.info("key", event);

      this.addKeyboardRecord({
        keycode: event.keycode,
        modifiers: event.mods,
        type: event.type || KeymapType.Plain,
        coordinates: {
          layer: event.layer,
          column: event.col,
          row: event.row,
        },
      });
    });

    try {
      let keyboard: Keyboard | null = await this.#keyboardRepo.create(
        hidKeyboard.deviceConfig,
      );
      this.#keyboardId = keyboard.id!;

      const keys = await this.#keysService.createKeysWithLayout(
        this.#keyboardId,
        hidKeyboard.deviceConfig.fingerMap,
      );
      keyboard.keys = keys;

      // Read the layers from the keyboard
      const keyboardLayers = await hidKeyboard.getLayers();

      keyboard = await this.saveKeyboardKeymap(keyboard, keyboardLayers);
    } catch (err) {
      this.#logger.error(err);
    }
  }

  stop(_keyboard: HIDKeyboard) {
    this.#keyHandler.removeAllListeners();
  }
}

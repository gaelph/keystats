import KeyboardRepo from "./repository/keyboardRepo.js";
import KeysRepo from "./repository/keysRepo.js";
import KeymapRepo from "./repository/keymapRepo.js";
import LayerRepo from "./repository/layerRepo.js";
import HandService from "./handService.js";
import FingerService from "./fingerService.js";

import Keyboard from "./models/keyboard.js";

import type HIDKeyboard from "../hid/HIDKeyboard.js";
import KeyHandler from "../lib/eventHandler.js";

import log from "loglevel";
import RecordService from "./recordService.js";
import { KeymapType } from "./models/keymap.js";
import LayerService from "./layerService.js";

interface CreateKeyboardPayload {
  name: string;
  vendorId: number;
  productId: number;
  fingerMap: number[][];
}

export default class KeyboardService {
  #keyboardRepo: KeyboardRepo;
  #layerRepo: LayerRepo;
  #keysRepo: KeysRepo;
  #keymapRepo: KeymapRepo;
  #fingerService: FingerService;
  #handService: HandService;
  #layerService: LayerService;
  #recordService: RecordService;
  #keyHandler: KeyHandler;
  #keyboardId: number = 0;

  #logger = log.getLogger("KeyboardService");

  constructor(
    recordService?: RecordService,
    handService?: HandService,
    fingerService?: FingerService,
    layerService?: LayerService,
    keyHandler?: KeyHandler,
  ) {
    this.#keyboardRepo = new KeyboardRepo();
    this.#layerRepo = new LayerRepo();
    this.#keysRepo = new KeysRepo();
    this.#keymapRepo = new KeymapRepo();
    this.#recordService = recordService || new RecordService();
    this.#handService = handService || new HandService();
    this.#fingerService = fingerService || new FingerService();
    this.#layerService = layerService || new LayerService();
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

      keyboard.keys = await this.#keysRepo.createKeysWithLayout(
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

  async getKeymap(
    keyboardId: number,
  ): Promise<{ keycode: string; type: string }[][][][]> {
    try {
      const layerMap = await this.#keymapRepo.getKeyboardKeymaps(keyboardId);
      const layers: { keycode: string; type: string }[][][][] = [[[[]]]];

      for (const [layerId, keymaps] of layerMap.entries()) {
        if (!layers[layerId]) {
          layers[layerId] = [];
        }
        for (const keymap of keymaps) {
          if (!layers[layerId][keymap.key!.row]) {
            layers[layerId][keymap.key!.row] = [];
          }
          if (!layers[layerId][keymap.key!.row][keymap.key!.column]) {
            layers[layerId][keymap.key!.row][keymap.key!.column] = [];
          }
          layers[layerId][keymap.key!.row][keymap.key!.column].push({
            keycode: keymap.keycode,
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
      const layers = await Promise.all(
        keymap.map(async (layout, index) => {
          let layer = this.#layerRepo.build({ keyboardId, index });
          layer = await this.#layerRepo.create(layer);
          this.#logger.debug(`Created layer ${layer.id}`);
          const keymaps = await this.#layerService.createLayerMapping(
            keyboard.id!,
            layer.index,
            layout,
          );
          layer.keymaps = keymaps;

          return layer;
        }),
      );

      keyboard.layers = layers;

      return keyboard;
    } catch (err) {
      this.#logger.error(err);
      return null;
    }
  }

  async addKeyboardRecord(params: {
    keycode: string;
    type: KeymapType;
    col: number;
    row: number;
    layer: number;
    modifiers?: number;
  }) {
    this.#logger.debug("Adding keyboard record", params);
    try {
      this.#recordService.addRecord(
        this.#keyboardId,
        params.layer,
        params.keycode,
        params.modifiers || 0,
        params.row,
        params.col,
        params.type,
      );
    } catch (error) {
      this.#logger.error("Failed to add keyboard record", error);
    }

    try {
      this.#handService.incrementHandUsage(
        this.#keyboardId,
        params.col,
        params.row,
      );
    } catch (error) {
      this.#logger.error("Failed to increment hand usage", error);
    }

    try {
      this.#fingerService.incrementFingerUsage(
        this.#keyboardId,
        params.col,
        params.row,
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
        col: event.col,
        row: event.row,
        layer: event.layer,
        type: event.type || KeymapType.Plain,
      });
    });

    try {
      let keyboard: Keyboard | null = await this.#keyboardRepo.create(
        hidKeyboard.deviceConfig,
      );
      this.#keyboardId = keyboard.id!;

      const keys = await this.#keysRepo.createKeysWithLayout(
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

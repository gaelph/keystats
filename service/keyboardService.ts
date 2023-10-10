import Fs from "fs/promises";
import Path from "path";
import Url from "url";

import KeyboardRepo from "./repository/keyboardRepo.js";
import KeysRepo from "./repository/keysRepo.js";
import LayerRepo from "./repository/layerRepo.js";
import HandService from "./handService.js";
import FingerService from "./fingerService.js";

import Keyboard from "./models/keyboard.js";

import type HIDKeyboard from "../hid/HIDKeyboard.js";
import KeyHandler from "../lib/eventHandler.js";

const __dirname = Url.fileURLToPath(new URL("..", import.meta.url));
const LAYERS_PATH = Path.join(__dirname, "data", "layers.json");

import log from "loglevel";
import RecordService from "./recordService.js";
import { KeymapType } from "./models/keymap.js";

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
  #recordService: RecordService;
  #handService: HandService;
  #fingerService: FingerService;
  #keyHandler: KeyHandler;
  #keyboardId: number = 0;

  #logger = log.getLogger("KeyboardService");

  constructor(
    keyboardRepo: KeyboardRepo,
    layerRepo: LayerRepo,
    keysRepo: KeysRepo,
    recordService: RecordService,
    handService: HandService,
    fingerService: FingerService,
    keyHandler: KeyHandler,
  ) {
    this.#keyboardRepo = keyboardRepo;
    this.#layerRepo = layerRepo;
    this.#keysRepo = keysRepo;
    this.#recordService = recordService;
    this.#handService = handService;
    this.#fingerService = fingerService;
    this.#keyHandler = keyHandler;
  }

  async createKeyboard({
    name,
    vendorId,
    productId,
    fingerMap,
  }: CreateKeyboardPayload): Promise<Keyboard> {
    const keyboard = await this.#keyboardRepo.create({
      name,
      vendorId,
      productId,
    });

    keyboard.keys = await this.#keysRepo.createKeysWithLayout(
      keyboard.id,
      fingerMap,
    );

    return keyboard;
  }

  async listKeyboards(): Promise<Keyboard[]> {
    return this.#keyboardRepo.getAll();
  }

  async getKeymap(
    keyboardId: number,
  ): Promise<{ keycode: string; type: string }[][][][]> {
    const layerMap = await this.#layerRepo.getKeyboardKeymaps(keyboardId);
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
  }

  async saveKeyboardKeymap(
    keyboard: Keyboard,
    keymap: string[][][],
  ): Promise<Keyboard> {
    let keyboardId = 0;
    if (keyboard instanceof Keyboard && keyboard.id) {
      keyboardId = keyboard.id;
    } else {
      throw new Error("Invalid keyboard id");
    }

    const layers = await Promise.all(
      keymap.map(async (layout, index) => {
        let layer = this.#layerRepo.build({ keyboardId, index });
        layer = await this.#layerRepo.create(layer);
        this.#logger.debug(`Created layer ${layer.id}`);
        const keymaps = await this.#layerRepo.createLayerMapping(
          layer.index,
          layout,
        );
        layer.keymaps = keymaps;

        return layer;
      }),
    );

    keyboard.layers = layers;

    return keyboard;
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
    console.debug("Adding keyboard record", params);
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

    this.#handService.incrementHandUsage(
      this.#keyboardId,
      params.col,
      params.row,
    );

    this.#fingerService.incrementFingerUsage(
      this.#keyboardId,
      params.col,
      params.row,
    );
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
        type: KeymapType.Plain,
      });
    });

    let keyboard = await this.#keyboardRepo.create(hidKeyboard.deviceConfig);
    this.#keyboardId = keyboard.id!;
    const keys = await this.#keysRepo.createKeysWithLayout(
      keyboard.id,
      hidKeyboard.deviceConfig.fingerMap,
    );
    keyboard.keys = keys;

    // Read the layers from the keyboard
    const keyboardLayers = await hidKeyboard.getLayers();

    keyboard = await this.saveKeyboardKeymap(keyboard, keyboardLayers);

    // Save them
    try {
      await Fs.writeFile(LAYERS_PATH, JSON.stringify(keyboardLayers));
    } catch (error: unknown) {
      this.#logger.error(error);
    }
  }

  stop(_keyboard: HIDKeyboard) {
    this.#keyHandler.removeAllListeners();
  }
}

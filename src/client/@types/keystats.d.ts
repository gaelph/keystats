import { Knex } from "knex";

declare module "knex/types/tables" {
  interface Keyboard {
    id: number;
    name: string;
    vendorId: number;
    productId: number;
  }

  interface Key {
    keyboardId: Keyboard["id"];
    column: number;
    row: number;
    finger: number;
    hand: number;
  }

  interface Keymap {
    id: number;
    keycode: string;
    type: "plain" | "mtap" | "ltap" | "lmod";
    layer: number;
    keyboardId: Key["keyboardId"];
    column: Key["column"];
    row: Key["row"];
  }

  interface Record {
    id: number;
    date: Date;
    modifiers: number;
    counts: number;
    keymapId: Keymap["id"];
  }

  interface FingerUsage {
    id: number;
    count: number;
    finger: number;
    repeats: number;
    date: string;
    keyboardId: Keyboard["id"];
    createdAt: Date;
    updatedAt: Date;
  }

  interface HandUsage {
    id: number;
    count: number;
    hand: number;
    repeats: number;
    date: string;
    keyboardId: Keyboard["id"];
    createdAt: Date;
    updatedAt: Date;
  }

  interface Tables {
    keyboards: Keyboard;
    keyboards_composite: Knex.CompositeTableType<
      Keyboard,
      Pick<Keyboard, "name" | "vendorId" | "productId">,
      Pick<Keyboard, "name">
    >;
    //
    keys: Key;
    keys_composite: Knex.CompositeTableType<
      Key,
      Pick<Key, "keyboardId" | "column" | "row" | "finger" | "hand">,
      Pick<Key, "finger" | "hand">
    >;
    //
    keymaps: Keymap;
    keymaps_composite: Knex.CompositeTableType<
      Keymap,
      Pick<
        Keymap,
        "keycode" | "type" | "layer" | "keyboardId" | "column" | "row"
      >,
      Pick<Keymap, "keycode" | "type">
    >;
    //
    records: Record;
    records_composite: Knex.CompositeTableType<
      Record,
      Pick<Record, "date" | "modifiers" | "counts" | "keymapId">,
      Pick<Record, "counts">
    >;
    //
    finger_usage: FingerUsage;
    finger_usage_composite: Knex.CompositeTableType<
      FingerUsage,
      Pick<
        FingerUsage,
        | "count"
        | "finger"
        | "repeats"
        | "date"
        | "keyboardId"
        | "createdAt"
        | "updatedAt"
      >,
      Pick<FingerUsage, "count">
    >;
    //
    hand_usage: HandUsage;
    hand_usage_composite: Knex.CompositeTableType<
      HandUsage,
      Pick<
        HandUsage,
        | "count"
        | "hand"
        | "repeats"
        | "date"
        | "keyboardId"
        | "createdAt"
        | "updatedAt"
      >,
      Pick<HandUsage, "count">
    >;
  }
}

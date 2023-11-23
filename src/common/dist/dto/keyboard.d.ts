import dayjs from "dayjs";
import { z } from "zod";
export declare const keyboardIdParam: z.ZodObject<{
    keyboardId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    keyboardId: number;
}, {
    keyboardId: number;
}>;
export type KeyboardIdParam = z.infer<typeof keyboardIdParam>;
export declare const filterQuery: z.ZodObject<{
    date: z.ZodOptional<z.ZodEffects<z.ZodType<dayjs.Dayjs, z.ZodTypeDef, dayjs.Dayjs>, dayjs.Dayjs, unknown>>;
}, "strip", z.ZodTypeAny, {
    date?: dayjs.Dayjs | undefined;
}, {
    date?: unknown;
}>;
export type FilterQuery = z.infer<typeof filterQuery>;
export declare function serializeFilterQuery(query: FilterQuery): Record<string, string>;
export declare const keyboardListBody: z.ZodObject<{
    keyboards: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    keyboards: {
        id: number;
        name: string;
    }[];
}, {
    keyboards: {
        id: number;
        name: string;
    }[];
}>;
export type KeyboardListBody = z.infer<typeof keyboardListBody>;
declare const keymap: z.ZodObject<{
    keycode: z.ZodString;
    type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
    character: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    character?: string | undefined;
}, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    character?: string | undefined;
}>;
export type Keymap = z.infer<typeof keymap>;
export declare const keymapsBody: z.ZodObject<{
    keymaps: z.ZodArray<z.ZodArray<z.ZodArray<z.ZodArray<z.ZodObject<{
        keycode: z.ZodString;
        type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
        character: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }>, "many">, "many">, "many">, "many">;
}, "strip", z.ZodTypeAny, {
    keymaps: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }[][][][];
}, {
    keymaps: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }[][][][];
}>;
export type KeymapsBody = z.infer<typeof keymapsBody>;
export declare const datesBody: z.ZodObject<{
    dates: z.ZodArray<z.ZodDate, "many">;
}, "strip", z.ZodTypeAny, {
    dates: Date[];
}, {
    dates: Date[];
}>;
export type DatesBody = z.infer<typeof datesBody>;
declare const keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
declare const layerUsage: z.ZodRecord<z.ZodString, z.ZodDefault<z.ZodNumber>>;
declare const rowUsage: z.ZodRecord<z.ZodString, z.ZodDefault<z.ZodNumber>>;
declare const handUsage: z.ZodObject<{
    0: z.ZodDefault<z.ZodNumber>;
    1: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    0: number;
    1: number;
}, {
    0?: number | undefined;
    1?: number | undefined;
}>;
declare const fingerUsage: z.ZodObject<{
    0: z.ZodDefault<z.ZodNumber>;
    1: z.ZodDefault<z.ZodNumber>;
    2: z.ZodDefault<z.ZodNumber>;
    3: z.ZodDefault<z.ZodNumber>;
    4: z.ZodDefault<z.ZodNumber>;
    5: z.ZodDefault<z.ZodNumber>;
    6: z.ZodDefault<z.ZodNumber>;
    7: z.ZodDefault<z.ZodNumber>;
    8: z.ZodDefault<z.ZodNumber>;
    9: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    0: number;
    2: number;
    1: number;
    5: number;
    3: number;
    4: number;
    6: number;
    7: number;
    8: number;
    9: number;
}, {
    0?: number | undefined;
    1?: number | undefined;
    2?: number | undefined;
    3?: number | undefined;
    4?: number | undefined;
    5?: number | undefined;
    6?: number | undefined;
    7?: number | undefined;
    8?: number | undefined;
    9?: number | undefined;
}>;
export type KeymapUsage = z.infer<typeof keymapUsage>;
export type LayerUsage = z.infer<typeof layerUsage>;
export type RowUsage = z.infer<typeof rowUsage>;
export type HandUsage = z.infer<typeof handUsage>;
export type FingerUsage = z.infer<typeof fingerUsage>;
export declare const totalCountBody: z.ZodObject<{
    keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
    layerUsage: z.ZodRecord<z.ZodString, z.ZodDefault<z.ZodNumber>>;
    rowUsage: z.ZodRecord<z.ZodString, z.ZodDefault<z.ZodNumber>>;
    handUsage: z.ZodObject<{
        0: z.ZodDefault<z.ZodNumber>;
        1: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        0: number;
        1: number;
    }, {
        0?: number | undefined;
        1?: number | undefined;
    }>;
    fingerUsage: z.ZodObject<{
        0: z.ZodDefault<z.ZodNumber>;
        1: z.ZodDefault<z.ZodNumber>;
        2: z.ZodDefault<z.ZodNumber>;
        3: z.ZodDefault<z.ZodNumber>;
        4: z.ZodDefault<z.ZodNumber>;
        5: z.ZodDefault<z.ZodNumber>;
        6: z.ZodDefault<z.ZodNumber>;
        7: z.ZodDefault<z.ZodNumber>;
        8: z.ZodDefault<z.ZodNumber>;
        9: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        0: number;
        2: number;
        1: number;
        5: number;
        3: number;
        4: number;
        6: number;
        7: number;
        8: number;
        9: number;
    }, {
        0?: number | undefined;
        1?: number | undefined;
        2?: number | undefined;
        3?: number | undefined;
        4?: number | undefined;
        5?: number | undefined;
        6?: number | undefined;
        7?: number | undefined;
        8?: number | undefined;
        9?: number | undefined;
    }>;
    totalKeypresses: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    keymapUsage: number[][][];
    layerUsage: Record<string, number>;
    rowUsage: Record<string, number>;
    handUsage: {
        0: number;
        1: number;
    };
    fingerUsage: {
        0: number;
        2: number;
        1: number;
        5: number;
        3: number;
        4: number;
        6: number;
        7: number;
        8: number;
        9: number;
    };
    totalKeypresses: number;
}, {
    keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
    layerUsage: Record<string, number | undefined>;
    rowUsage: Record<string, number | undefined>;
    handUsage: {
        0?: number | undefined;
        1?: number | undefined;
    };
    fingerUsage: {
        0?: number | undefined;
        1?: number | undefined;
        2?: number | undefined;
        3?: number | undefined;
        4?: number | undefined;
        5?: number | undefined;
        6?: number | undefined;
        7?: number | undefined;
        8?: number | undefined;
        9?: number | undefined;
    };
    totalKeypresses: number;
}>;
export type TotalCountBody = z.infer<typeof totalCountBody>;
declare const character: z.ZodObject<{
    keycode: z.ZodString;
    modifiers: z.ZodNumber;
    counts: z.ZodNumber;
    character: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    keycode: string;
    modifiers: number;
    counts: number;
    character?: string | undefined;
}, {
    keycode: string;
    modifiers: number;
    counts: number;
    character?: string | undefined;
}>;
export type Character = z.infer<typeof character>;
export declare const characterCountBody: z.ZodObject<{
    records: z.ZodDefault<z.ZodArray<z.ZodObject<{
        keycode: z.ZodString;
        modifiers: z.ZodNumber;
        counts: z.ZodNumber;
        character: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        keycode: string;
        modifiers: number;
        counts: number;
        character?: string | undefined;
    }, {
        keycode: string;
        modifiers: number;
        counts: number;
        character?: string | undefined;
    }>, "many">>;
    totalCharacters: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    records: {
        keycode: string;
        modifiers: number;
        counts: number;
        character?: string | undefined;
    }[];
    totalCharacters: number;
}, {
    records?: {
        keycode: string;
        modifiers: number;
        counts: number;
        character?: string | undefined;
    }[] | undefined;
    totalCharacters?: number | undefined;
}>;
export type CharacterCountBody = z.infer<typeof characterCountBody>;
declare const handRepetitions: z.ZodArray<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">, "many">;
export type HandRepetitions = z.infer<typeof handRepetitions>;
declare const fingerRepetitions: z.ZodArray<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">, "many">;
export type FingerRepetitions = z.infer<typeof fingerRepetitions>;
export declare const repetitionsBody: z.ZodObject<{
    handRepetitions: z.ZodArray<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">, "many">;
    fingerRepetitions: z.ZodArray<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">, "many">;
}, "strip", z.ZodTypeAny, {
    handRepetitions: number[][];
    fingerRepetitions: number[][];
}, {
    handRepetitions: (number | undefined)[][];
    fingerRepetitions: (number | undefined)[][];
}>;
export type RepetitionsBody = z.infer<typeof repetitionsBody>;
export {};
//# sourceMappingURL=keyboard.d.ts.map
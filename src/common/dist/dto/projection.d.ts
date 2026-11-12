import { z } from "zod";
export declare const projectionDate: z.ZodEffects<z.ZodString, string, string>;
export declare const projectionQuery: z.ZodObject<{
    date: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strict", z.ZodTypeAny, {
    date?: string | undefined;
}, {
    date?: string | undefined;
}>;
export declare const projectionKeyboardParam: z.ZodObject<{
    keyboardId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    keyboardId: number;
}, {
    keyboardId: number;
}>;
export declare const projectionGroup: z.ZodObject<{
    keycode: z.ZodString;
    modifiers: z.ZodNumber;
    type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
    count: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    modifiers: number;
    count: number;
}, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    modifiers: number;
    count: number;
}>;
export declare const projectionPositionGroup: z.ZodObject<{
    type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
    keycode: z.ZodString;
    modifiers: z.ZodNumber;
    count: z.ZodNumber;
    layer: z.ZodNumber;
    row: z.ZodNumber;
    column: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    layer: number;
    modifiers: number;
    count: number;
    row: number;
    column: number;
}, {
    type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
    keycode: string;
    layer: number;
    modifiers: number;
    count: number;
    row: number;
    column: number;
}>;
export declare const observedProjection: z.ZodObject<{
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
    keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
    totalKeypresses: z.ZodNumber;
    unplacedUses: z.ZodOptional<z.ZodNumber>;
    physicalKeys: z.ZodOptional<z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        column: z.ZodNumber;
        hand: z.ZodNullable<z.ZodNumber>;
        finger: z.ZodNullable<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        row: number;
        column: number;
        hand: number | null;
        finger: number | null;
    }, {
        row: number;
        column: number;
        hand: number | null;
        finger: number | null;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    keymaps: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }[][][][];
    keymapUsage: number[][][];
    totalKeypresses: number;
    unplacedUses?: number | undefined;
    physicalKeys?: {
        row: number;
        column: number;
        hand: number | null;
        finger: number | null;
    }[] | undefined;
}, {
    keymaps: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }[][][][];
    keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
    totalKeypresses: number;
    unplacedUses?: number | undefined;
    physicalKeys?: {
        row: number;
        column: number;
        hand: number | null;
        finger: number | null;
    }[] | undefined;
}>;
export declare const printingProjection: z.ZodEffects<z.ZodObject<{
    groups: z.ZodArray<z.ZodObject<{
        keycode: z.ZodString;
        modifiers: z.ZodNumber;
        type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
        count: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }>, "many">;
    sourceEventCount: z.ZodNumber;
    excludedEventCount: z.ZodNumber;
    modifierParticipationCount: z.ZodNumber;
    observed: z.ZodObject<{
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
        keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
        totalKeypresses: z.ZodNumber;
        unplacedUses: z.ZodOptional<z.ZodNumber>;
        physicalKeys: z.ZodOptional<z.ZodArray<z.ZodObject<{
            row: z.ZodNumber;
            column: z.ZodNumber;
            hand: z.ZodNullable<z.ZodNumber>;
            finger: z.ZodNullable<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }, {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    }, {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    excludedEventCount: number;
    modifierParticipationCount: number;
    observed: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    };
}, {
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    excludedEventCount: number;
    modifierParticipationCount: number;
    observed: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    };
}>, {
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    excludedEventCount: number;
    modifierParticipationCount: number;
    observed: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    };
}, {
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    excludedEventCount: number;
    modifierParticipationCount: number;
    observed: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    };
}>;
export declare const projectionSource: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    keyboardId: z.ZodNumber;
    date: z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>;
    sourceEventCount: z.ZodNumber;
    groups: z.ZodArray<z.ZodObject<{
        keycode: z.ZodString;
        modifiers: z.ZodNumber;
        type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
        count: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }, {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }>, "many">;
    observed: z.ZodOptional<z.ZodObject<{
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
        keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
        totalKeypresses: z.ZodNumber;
        unplacedUses: z.ZodOptional<z.ZodNumber>;
        physicalKeys: z.ZodOptional<z.ZodArray<z.ZodObject<{
            row: z.ZodNumber;
            column: z.ZodNumber;
            hand: z.ZodNullable<z.ZodNumber>;
            finger: z.ZodNullable<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }, {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    }, {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    }>>;
    printing: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        groups: z.ZodArray<z.ZodObject<{
            keycode: z.ZodString;
            modifiers: z.ZodNumber;
            type: z.ZodEnum<["plain", "mtap", "ltap", "lmod", "layer"]>;
            count: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }, {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }>, "many">;
        sourceEventCount: z.ZodNumber;
        excludedEventCount: z.ZodNumber;
        modifierParticipationCount: z.ZodNumber;
        observed: z.ZodObject<{
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
            keymapUsage: z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodArray<z.ZodDefault<z.ZodNumber>, "many">>, "many">>, "many">;
            totalKeypresses: z.ZodNumber;
            unplacedUses: z.ZodOptional<z.ZodNumber>;
            physicalKeys: z.ZodOptional<z.ZodArray<z.ZodObject<{
                row: z.ZodNumber;
                column: z.ZodNumber;
                hand: z.ZodNullable<z.ZodNumber>;
                finger: z.ZodNullable<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }, {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }>, "many">>;
        }, "strict", z.ZodTypeAny, {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        }, {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    }, {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    }>, {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    }, {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    }>>;
}, "strict", z.ZodTypeAny, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}>, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}>, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}>, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: number[][][];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: number[][][];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}, {
    keyboardId: number;
    date: string | null;
    groups: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        modifiers: number;
        count: number;
    }[];
    sourceEventCount: number;
    observed?: {
        keymaps: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            character?: string | undefined;
        }[][][][];
        keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
        totalKeypresses: number;
        unplacedUses?: number | undefined;
        physicalKeys?: {
            row: number;
            column: number;
            hand: number | null;
            finger: number | null;
        }[] | undefined;
    } | undefined;
    printing?: {
        groups: {
            type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
            keycode: string;
            modifiers: number;
            count: number;
        }[];
        sourceEventCount: number;
        excludedEventCount: number;
        modifierParticipationCount: number;
        observed: {
            keymaps: {
                type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
                keycode: string;
                character?: string | undefined;
            }[][][][];
            keymapUsage: (((number | undefined)[] | undefined)[] | undefined)[];
            totalKeypresses: number;
            unplacedUses?: number | undefined;
            physicalKeys?: {
                row: number;
                column: number;
                hand: number | null;
                finger: number | null;
            }[] | undefined;
        };
    } | undefined;
}>;
export type ProjectionGroup = z.infer<typeof projectionGroup>;
export type ProjectionSource = z.infer<typeof projectionSource>;
export type ObservedProjection = z.infer<typeof observedProjection>;
export type ProjectionPositionGroup = z.infer<typeof projectionPositionGroup>;
export type PrintingProjection = z.infer<typeof printingProjection>;
//# sourceMappingURL=projection.d.ts.map
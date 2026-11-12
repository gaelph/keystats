import type { KeyboardUsage } from "../projection/usage.js";
export type TrendGrouping = "daily" | "weekly" | "monthly";
export interface TrendBucket {
    start: string;
    end: string;
    partial: boolean;
    recordedDays: number;
    calendarDays: number;
    recorded: number;
    printing: number;
    characters: Record<string, number>;
    characterTotal: number;
    controls: Record<string, number>;
    controlTotal: number;
    allUsage: KeyboardUsage | null;
    printingUsage: KeyboardUsage | null;
}
export interface TrendsResponse {
    keyboardId: number;
    start: string;
    end: string;
    grouping: TrendGrouping;
    buckets: TrendBucket[];
    characters: string[];
    controls: string[];
    generatedAt: string;
}
//# sourceMappingURL=trends.d.ts.map
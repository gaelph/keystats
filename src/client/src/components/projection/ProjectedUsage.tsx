import React, { useMemo } from "react";
import { projectedUsage, type LayoutProfile, type ProjectionResult } from "keystats-common/projection";
import { formatCount } from "./KeyboardDiagram.js";
import UsageStatistics from "./UsageStatistics.js";

export default function ProjectedUsage({ result, profile }: { result: ProjectionResult; profile: LayoutProfile }) {
  const usage = useMemo(() => projectedUsage(result, profile), [result, profile]);
  return <UsageStatistics usage={usage}
    description={<>Percentages of all {formatCount(usage.total)} estimated key uses, including participating modifiers.
      Standard touch typing is assumed, not measured.</>}
    notes={<>Space uses the left thumb; Command/Option use thumbs; Control/Fn use the left pinkie.
      Function/media keys and arrows have no fixed touch-typing finger and remain unassigned, as do unplaced uses.
      Same-hand and same-finger repetitions cannot be reconstructed from historical aggregates.</>} />;
}

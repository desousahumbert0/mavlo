"use client";

import UnitConverter from "@/components/ui/UnitConverter";
import { weightUnits } from "@/lib/units";

export default function WeightConverter() {
  return <UnitConverter units={weightUnits} defaultFrom="kg" defaultTo="lb" />;
}

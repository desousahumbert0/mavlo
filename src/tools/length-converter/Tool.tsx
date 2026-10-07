"use client";

import UnitConverter from "@/components/ui/UnitConverter";
import { lengthUnits } from "@/lib/units";

export default function LengthConverter() {
  return <UnitConverter units={lengthUnits} defaultFrom="cm" defaultTo="in" />;
}

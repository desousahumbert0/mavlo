/** Unit tables. `factor` is the size of one unit expressed in the base unit (metre for length, kilogram for weight). */
export type Unit = { id: string; label: string; symbol: string; factor: number };

export const lengthUnits: Unit[] = [
  { id: "mm", label: "Millimeter", symbol: "mm", factor: 0.001 },
  { id: "cm", label: "Centimeter", symbol: "cm", factor: 0.01 },
  { id: "m", label: "Meter", symbol: "m", factor: 1 },
  { id: "km", label: "Kilometer", symbol: "km", factor: 1000 },
  { id: "in", label: "Inch", symbol: "in", factor: 0.0254 },
  { id: "ft", label: "Foot", symbol: "ft", factor: 0.3048 },
  { id: "yd", label: "Yard", symbol: "yd", factor: 0.9144 },
  { id: "mi", label: "Mile", symbol: "mi", factor: 1609.344 },
  { id: "nmi", label: "Nautical mile", symbol: "nmi", factor: 1852 },
  { id: "um", label: "Micrometer", symbol: "µm", factor: 1e-6 },
];

export const weightUnits: Unit[] = [
  { id: "mg", label: "Milligram", symbol: "mg", factor: 1e-6 },
  { id: "g", label: "Gram", symbol: "g", factor: 0.001 },
  { id: "kg", label: "Kilogram", symbol: "kg", factor: 1 },
  { id: "t", label: "Metric tonne", symbol: "t", factor: 1000 },
  { id: "oz", label: "Ounce", symbol: "oz", factor: 0.028349523125 },
  { id: "lb", label: "Pound", symbol: "lb", factor: 0.45359237 },
  { id: "st", label: "Stone", symbol: "st", factor: 6.35029318 },
  { id: "ton-us", label: "US short ton", symbol: "US ton", factor: 907.18474 },
  { id: "ton-uk", label: "UK long ton", symbol: "UK ton", factor: 1016.0469088 },
];

export function findUnit(units: Unit[], id: string | null | undefined): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function convert(value: number, from: Unit, to: Unit): number {
  return (value * from.factor) / to.factor;
}

import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "weight-converter",
    category: "converters",
    glyph: "kg",
    slugs: { en: "weight-converter" },
    texts: {
      en: {
        name: "Weight Converter",
        title: "Weight Converter: Kilograms, Pounds, Ounces, Stones",
        metaDescription:
          "Convert kilograms, grams, pounds, ounces, stones and tonnes with exact factors. See your weight in every unit at once. Free and instant.",
        h1: "Weight Converter",
        tagline: "Kilograms to pounds and every other weight unit, with exact factors.",
      },
    },
    keywords: ["weight", "mass", "convert", "kg", "kilograms", "lbs", "pounds", "lb", "ounces", "oz", "grams", "stone", "tonne", "ton", "body weight"],
    related: ["length-converter", "percentage-calculator"],
    presets: [
      { label: "KG to Pounds", query: "from=kg&to=lb", keywords: ["kilograms to pounds", "kg to lbs", "kg to lb"] },
      { label: "Pounds to KG", query: "from=lb&to=kg", keywords: ["pounds to kilograms", "lbs to kg", "lb to kg"] },
      { label: "Grams to Ounces", query: "from=g&to=oz", keywords: ["g to oz"] },
      { label: "Ounces to Grams", query: "from=oz&to=g", keywords: ["oz to g"] },
      { label: "Stone to KG", query: "from=st&to=kg", keywords: ["stone to kilograms", "st to kg"] },
    ],
    flags: { popular: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "This weight converter turns kilograms into pounds, pounds into kilograms and any other combination of common mass units: milligrams, grams, ounces, stones and tonnes. Enter a value, pick the two units and read the answer. A table below lists the same weight in every unit.",
        "Strictly speaking, kilograms and pounds measure mass, while weight is the force of gravity on a mass. In everyday use, and in every shop, recipe and passport form, “weight” means mass, and that is what this tool converts.",
      ],
      howTo: [
        "Type the weight in the Value box.",
        "Select the starting unit in “From” and the target unit in “To”.",
        "Read the converted weight and copy it if you need it elsewhere.",
        "Open the table to compare the same weight across all units, such as kilograms, pounds and stones.",
      ],
      howItWorks: {
        paragraphs: [
          "Every unit is defined as an exact fraction or multiple of the kilogram, and the converter passes through it. The international avoirdupois pound is defined as exactly 0.45359237 kilograms, and the ounce is one sixteenth of a pound, or 28.349523125 grams. A stone is 14 pounds.",
          "Because the factors are exact definitions, the only rounding happens when the answer is displayed, with up to ten significant digits.",
          "The word ton has three meanings: the metric tonne of 1,000 kilograms, the US short ton of 2,000 pounds and the UK long ton of 2,240 pounds. Each has its own entry so there is no ambiguity.",
        ],
        formula: "result = value × (kg in source unit) ÷ (kg in target unit)\n1 lb = 0.45359237 kg · 1 oz = 28.349523125 g · 1 st = 14 lb",
      },
      examples: [
        { title: "Body weight: 70 kg in pounds and stones", body: "70 kilograms equal 154.32 pounds, or about 11.02 stones, which is 11 stone and 0.3 lb." },
        { title: "A 5 lb bag of flour", body: "5 pounds equal 2.268 kilograms, or 2,268 grams." },
        { title: "A 250 g recipe ingredient", body: "250 grams equal 8.818 ounces, which is just over 8¾ oz." },
        { title: "A suitcase limit of 23 kg", body: "23 kilograms equal 50.71 pounds, so an airline's 50 lb limit is a little under 23 kg." },
      ],
      useCases: [
        "Converting body weight, baby weight and luggage allowances between kilograms and pounds.",
        "Scaling recipes that use ounces and grams.",
        "Checking shipping and postage weights, which are often quoted in pounds or kilograms.",
        "Reading product labels and fitness equipment in the other system.",
      ],
      tips: [
        "For a quick kilograms-to-pounds estimate, double the kilograms and add 10%.",
        "Searches like “KG to Pounds” in the search box open this converter with those units selected.",
      ],
      faqs: [
        { q: "How many pounds are in a kilogram?", a: "One kilogram is about 2.2046 pounds. The exact relationship is 1 pound = 0.45359237 kilograms, so kilograms ÷ 0.45359237 gives pounds." },
        { q: "How do I convert pounds to kilograms?", a: "Multiply pounds by 0.45359237. For example 150 pounds equal 68.04 kilograms." },
        { q: "How many ounces are in a pound?", a: "There are 16 ounces in a pound. These are avoirdupois ounces, used for general goods. Troy ounces, used for precious metals, are different and not included here." },
        { q: "What is a stone?", a: "A stone is a British unit of 14 pounds, or about 6.35 kilograms. It is still widely used for body weight in the UK and Ireland." },
        { q: "Is a ton the same as a tonne?", a: "No. A metric tonne is 1,000 kilograms, a US short ton is 2,000 pounds (907.18 kg) and a UK long ton is 2,240 pounds (1,016.05 kg)." },
      ],
    },
  },
  Tool,
};

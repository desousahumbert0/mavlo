import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "length-converter",
    category: "converters",
    glyph: "m",
    slugs: { en: "length-converter" },
    texts: {
      en: {
        name: "Length Converter",
        title: "Length Converter: Metres, Feet, Inches, Miles & More",
        metaDescription:
          "Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards and miles with exact factors and a table showing every unit at once.",
        h1: "Length Converter",
        tagline: "Metric and imperial length units, with exact conversion factors.",
      },
    },
    keywords: ["length", "distance", "convert", "metric", "imperial", "cm", "inches", "inch", "feet", "foot", "meters", "metres", "miles", "km", "kilometers", "yards", "mm", "height"],
    related: ["weight-converter", "percentage-calculator"],
    presets: [
      { label: "CM to Inches", query: "from=cm&to=in", keywords: ["centimeters to inches", "cm to in"] },
      { label: "Inches to CM", query: "from=in&to=cm", keywords: ["inches to centimeters", "in to cm"] },
      { label: "Feet to Meters", query: "from=ft&to=m", keywords: ["feet to metres", "ft to m"] },
      { label: "Meters to Feet", query: "from=m&to=ft", keywords: ["metres to feet", "m to ft"] },
      { label: "Miles to KM", query: "from=mi&to=km", keywords: ["miles to kilometers", "mi to km"] },
      { label: "KM to Miles", query: "from=km&to=mi", keywords: ["kilometers to miles", "km to mi"] },
    ],
    flags: { popular: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "This length converter changes a measurement from one unit to another: centimetres to inches, feet to metres, miles to kilometres and every combination in between. Type a value, choose the units and the answer appears at once, together with a table that shows the same length in every unit.",
        "Two systems of measurement are in everyday use. The metric system, based on the metre, is used by almost every country, while the imperial and US customary systems, with inches, feet, yards and miles, are still common for heights, road distances and building work in the United States and the United Kingdom. Moving between them is exactly what this tool is for.",
      ],
      howTo: [
        "Enter the value you want to convert in the Value box.",
        "Choose the unit you have in “From” and the unit you want in “To”. Press the swap button to reverse them.",
        "Read the result in the highlighted box and copy it with one click.",
        "Use the table underneath to see the same length in all other units.",
      ],
      howItWorks: {
        paragraphs: [
          "Every unit is defined as an exact number of metres, and the converter goes through the metre. A value is first multiplied by the size of the source unit in metres and then divided by the size of the target unit. For example 1 inch is defined as exactly 25.4 millimetres, 1 foot as 0.3048 metres and 1 international mile as 1,609.344 metres.",
          "Because those definitions are exact, there is no rounding in the factors. The only rounding is in the display, where results show up to ten significant digits so that small values and large values both stay readable.",
          "The nautical mile is exactly 1,852 metres. The US survey foot, a slightly different unit used in some land surveys, is not included.",
        ],
        formula: "result = value × (metres in source unit) ÷ (metres in target unit)\n1 in = 0.0254 m · 1 ft = 0.3048 m · 1 mi = 1,609.344 m",
      },
      examples: [
        { title: "Height: 180 cm in feet and inches", body: "180 cm is 5.9055 feet. The decimal part, 0.9055 feet, equals about 10.9 inches, so 180 cm is roughly 5 ft 11 in." },
        { title: "A 10 km run in miles", body: "10 kilometres equal 6.2137 miles. A marathon of 42.195 km is 26.2188 miles." },
        { title: "A 55-inch television", body: "55 inches equal 139.7 centimetres. Screen sizes are measured diagonally." },
        { title: "A runway of 3,000 metres", body: "3,000 metres equal 9,842.5 feet, or 1.864 miles." },
      ],
      useCases: [
        "Converting heights, clothing and furniture sizes between metric and imperial.",
        "Reading distances in road signs, maps and running or cycling routes.",
        "Translating technical drawings, parts and building materials.",
        "Checking homework and exam problems about units.",
      ],
      tips: [
        "To go from inches to centimetres in your head, multiply by 2.5. For feet to metres, multiply by 0.3.",
        "Links such as “CM to Inches” in the search box open this converter with the units already selected.",
      ],
      faqs: [
        { q: "How many centimetres are in an inch?", a: "One inch is exactly 2.54 centimetres. To convert inches to centimetres multiply by 2.54, and to convert centimetres to inches divide by 2.54." },
        { q: "How many kilometres are in a mile?", a: "One international mile is exactly 1.609344 kilometres. A quick estimate is to multiply miles by 1.6." },
        { q: "How do I convert feet to metres?", a: "Multiply the number of feet by 0.3048. For example 6 feet equal 1.8288 metres." },
        { q: "Are the conversion factors exact?", a: "Yes. Inch, foot, yard and mile are defined in terms of the metre by international agreement, so the factors are exact. Results are rounded only for display." },
        { q: "Is the nautical mile the same as the mile?", a: "No. A nautical mile is exactly 1,852 metres, about 15% longer than the statute mile of 1,609.344 metres. It is used in aviation and at sea." },
      ],
    },
  },
  Tool,
};

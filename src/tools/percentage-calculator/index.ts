import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "percentage-calculator",
    category: "calculators",
    glyph: "%",
    slugs: { en: "percentage-calculator" },
    texts: {
      en: {
        name: "Percentage Calculator",
        title: "Percentage Calculator: Percent Of, Change, Increase & More",
        metaDescription:
          "Calculate X% of a number, what percent one number is of another, percentage change, increases and decreases, and the whole from a part. Instant and free.",
        h1: "Percentage Calculator",
        tagline: "Five common percentage calculations, answered as you type.",
      },
    },
    keywords: ["percentage", "percent", "percent of", "percentage change", "percentage increase", "percentage decrease", "discount", "markup", "tip", "ratio", "%"],
    related: ["age-calculator", "length-converter"],
    flags: { popular: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "A percentage is a way of saying “out of one hundred”, and it appears everywhere: discounts in shops, interest on savings, tax on a bill, changes in a price or in a grade. This calculator handles the five percentage questions that come up most, each in its own box, so you never have to remember which formula to use.",
        "Fill in the numbers in the box that matches your question and the answer appears immediately. You can use several boxes at once, and each one shows the formula so you can check the working.",
      ],
      howTo: [
        "Find the box that matches your question, for example “What is X% of Y?”.",
        "Type the two numbers. Decimals such as 12.5 are fine, and so are negative numbers where they make sense.",
        "Read the answer under the inputs. It updates on every keystroke.",
        "Use the formula under each box if you want to repeat the calculation by hand.",
      ],
      howItWorks: {
        paragraphs: [
          "Every percentage problem links three numbers: a part, a whole and a percentage. Knowing any two gives you the third. A percentage of a number is found by dividing the percentage by 100 and multiplying by the number.",
          "Percentage change compares a new value with an old one: subtract the old value from the new one, divide by the old value and multiply by 100. A positive result is an increase and a negative one a decrease. Note that the base matters: a price that rises 50% and then falls 50% ends below where it started.",
          "When the starting number is zero, a percentage change or a percentage of zero is undefined, so the calculator shows a dash instead of a misleading figure.",
        ],
        formula: "X% of Y = Y × X / 100\nX is what % of Y = X / Y × 100\nchange % = (new - old) / |old| × 100\nincrease by X% = Y × (1 + X / 100)\nwhole = part / X × 100",
      },
      examples: [
        { title: "A 15% tip on a 48.60 bill", body: "In “What is X% of Y?” enter 15 and 48.60. The tip is 7.29, so the total is 55.89." },
        { title: "A price rises from 80 to 92", body: "In “Percentage change” enter 80 and 92. The change is +15%, because 12 is 15% of 80." },
        { title: "A 20% discount on 250", body: "In “Increase or decrease” enter 250 and 20 and choose decrease. The sale price is 200." },
        { title: "30 is 12% of what number?", body: "In “X is Y% of what?” enter 30 and 12. The whole is 250." },
      ],
      useCases: [
        "Working out discounts, sales tax, VAT and tips while shopping or paying a bill.",
        "Comparing prices, salaries or statistics from two different years.",
        "Checking exam scores, such as 42 out of 60 as a percentage.",
        "Finding the original price when you only know the discounted price and the discount.",
      ],
      tips: [
        "To remove a percentage that was added, such as VAT, divide by 1 + rate rather than subtracting the rate: 120 including 20% VAT is 100 before VAT.",
        "Two successive percentage changes do not add up. Multiply the factors instead: +10% and then +10% is +21%.",
      ],
      faqs: [
        { q: "How do I calculate a percentage of a number?", a: "Divide the percentage by 100 and multiply by the number. For example 20% of 150 is 0.20 × 150, which is 30." },
        { q: "How do I work out a percentage increase?", a: "Subtract the old value from the new value, divide the result by the old value and multiply by 100. If a price goes from 50 to 60, the increase is 10 ÷ 50 × 100 = 20%." },
        { q: "What is the difference between percentage and percentage points?", a: "A percentage point is a simple difference between two percentages. If a rate moves from 4% to 5%, it rose by one percentage point, which is a 25% increase in the rate itself." },
        { q: "Why does the calculator show a dash?", a: "A dash means the answer is undefined, for instance a percentage change from zero, or asking what percent a number is of zero. Check that the number you divide by is not zero." },
        { q: "Can I use negative numbers or decimals?", a: "Yes. Decimals work everywhere, and negative numbers work where they make sense, such as a change from a negative starting value." },
      ],
    },
  },
  Tool,
};

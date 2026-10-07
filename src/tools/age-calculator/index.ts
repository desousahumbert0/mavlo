import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "age-calculator",
    category: "calculators",
    glyph: "Age",
    slugs: { en: "age-calculator" },
    texts: {
      en: {
        name: "Age Calculator",
        title: "Age Calculator: Exact Age in Years, Months & Days",
        metaDescription:
          "Find your exact age in years, months and days, plus total days lived, the weekday you were born and the days left until your next birthday. Free and private.",
        h1: "Age Calculator",
        tagline: "Exact age in years, months and days, from any date of birth.",
      },
    },
    keywords: ["age", "how old am i", "birthday", "date of birth", "birth date", "dob", "years old", "calculate age", "next birthday"],
    related: ["date-calculator", "percentage-calculator"],
    flags: { popular: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "This age calculator tells you exactly how old someone is, down to the day. Enter a date of birth and it returns the age in years, months and days, together with the total number of months, weeks, days and hours lived, the weekday of the birth date and the countdown to the next birthday.",
        "By default the age is calculated as of today, but you can change the “Age at” date to find out how old someone was on a past date or will be on a future one, for example on the first day of school or on a retirement date.",
      ],
      howTo: [
        "Enter the date of birth, or pick it from the calendar.",
        "Leave “Age at” as today, or choose another date to calculate the age on that day.",
        "Read the exact age at the top of the results.",
        "Scroll through the extra figures: total days, weeks, hours, birth weekday and days until the next birthday.",
      ],
      howItWorks: {
        paragraphs: [
          "The calculator counts complete calendar years first, then complete months, then the remaining days, which is the way ages are normally stated. A person born on 15 March 1990 is exactly 34 years old on 15 March 2024, and 34 years and 1 day old on 16 March 2024.",
          "Total days are the difference between the two calendar dates, so leap days are counted correctly. All the arithmetic is done on plain dates, which means time zones and daylight-saving changes cannot shift the result by a day.",
          "People born on 29 February celebrate in a non-leap year on 28 February in this calculator, which is the convention used by many legal systems for age milestones. Some countries use 1 March instead, so check local rules when the exact day matters.",
        ],
        formula: "age = complete years + complete months + remaining days\ntotal days = (age-at date) - (birth date)",
      },
      examples: [
        { title: "Born 15 March 1990, age on 20 May 2024", body: "The result is 34 years, 2 months and 5 days. That is 12,485 days lived in total, and the next birthday is on 15 March 2025." },
        { title: "Age on a future date", body: "Someone born on 1 September 2018 starts school on 1 September 2024. Set “Age at” to that date to see that the child will be exactly 6 years old." },
        { title: "Leap-day birthday", body: "For a birth date of 29 February 2000, the calculator shows the next birthday as 28 February in a non-leap year and 29 February in a leap year." },
      ],
      useCases: [
        "Checking whether someone meets a minimum or maximum age for a course, competition, job or benefit.",
        "Filling in forms that ask for age in years and months, such as paediatric or school forms.",
        "Planning a birthday or milestone by seeing exactly how many days remain.",
        "Finding out how many days old you are, or when you will reach a round number such as 10,000 days.",
      ],
      tips: [
        "To find someone's age on a specific past date, such as the date of an event, change the “Age at” date.",
        "Use the date picker on a phone, or type the date in your browser's usual format.",
      ],
      faqs: [
        { q: "How is age calculated in years, months and days?", a: "The calculator counts the full years between the dates, then the full months left over, then the remaining days. This is the same method people use when they say someone is “34 years and 2 months old”." },
        { q: "Can I calculate my age on a future or past date?", a: "Yes. Change the “Age at” field to any date. The tool then shows the age on that date, which is useful for deadlines, eligibility rules and planning." },
        { q: "Why does the day count look different from my own estimate?", a: "Months have different lengths and leap years add a day, so rough estimates drift. The calculator uses the real calendar, so its total days is exact." },
        { q: "Is my date of birth stored or sent anywhere?", a: "No. The calculation runs in your browser and the date you enter never leaves your device." },
        { q: "How are leap-day birthdays handled?", a: "A birth date of 29 February is treated as 28 February in years that are not leap years when working out the next birthday. The age in years, months and days is still calculated from the actual dates." },
      ],
    },
  },
  Tool,
};

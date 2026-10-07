import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "date-calculator",
    category: "calculators",
    glyph: "Date",
    slugs: { en: "date-calculator" },
    texts: {
      en: {
        name: "Date Calculator",
        title: "Date Calculator: Days Between Dates, Add or Subtract",
        metaDescription:
          "Count the days between two dates, including weekdays and weeks, or add and subtract years, months, weeks and days from any date. Free, exact and private.",
        h1: "Date Calculator",
        tagline: "Days between two dates, or add and subtract time from a date.",
      },
    },
    keywords: ["date", "days between dates", "date difference", "add days", "subtract days", "business days", "weekdays", "countdown", "days until", "calendar"],
    related: ["age-calculator", "percentage-calculator"],
    flags: { new: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "The date calculator answers the two questions people ask about calendars most often: how much time is there between two dates, and what date is it after adding or subtracting some time? Use it to count down to a deadline, work out the length of a contract or find the date that is 90 days from now.",
        "In difference mode you get the span in years, months and days, plus the total number of days, weeks and weekdays. In add and subtract mode you enter any combination of years, months, weeks and days and see the resulting date and weekday.",
      ],
      howTo: [
        "Choose “Difference between dates” or “Add or subtract”.",
        "For a difference, pick the start and end dates. Tick the box if the end date itself should count as a full day.",
        "For adding or subtracting, pick the start date, choose add or subtract and enter the years, months, weeks and days.",
        "Read the result. The tool updates as you change any field.",
      ],
      howItWorks: {
        paragraphs: [
          "Dates are treated as calendar days without a time of day, so clocks changing for daylight saving time never affect the count. Total days are the exact difference between the two dates on the real Gregorian calendar, including leap days.",
          "When you add months, the day of the month is kept where possible. If the target month is shorter, the result is the last day of that month: January 31 plus one month is February 28, or February 29 in a leap year. Years are added as 12 months each.",
          "Weekdays are the Monday to Friday days within the span. Public holidays are not excluded because they differ by country and region, so subtract them yourself when you need working days.",
        ],
        formula: "days = end date - start date  (+1 if the end date is included)\nweekdays = days that fall on Monday-Friday",
      },
      examples: [
        { title: "Days between 1 January and 31 December 2024", body: "2024 is a leap year, so the difference is 365 days, or 52 weeks and 1 day. Including both the first and last day gives 366 days." },
        { title: "A date 90 days after 15 October 2026", body: "Choose Add, enter 90 days and the result is 13 January 2027, which falls on a Wednesday." },
        { title: "Adding one month to 31 January", body: "February has no 31st, so the result is the last day of February: 28 February, or 29 February in a leap year." },
      ],
      useCases: [
        "Counting the days left until a deadline, trip, exam or due date.",
        "Working out notice periods, warranty periods and contract lengths.",
        "Finding a date such as “30 days after the invoice date” for payment terms.",
        "Estimating the number of working days in a project schedule.",
      ],
      tips: [
        "Tick “Include end date” when both the first and the last day count, as with a hotel booking or a project that runs from the start of day one to the end of the last day.",
        "Subtract public holidays from the weekday count to estimate working days.",
      ],
      faqs: [
        { q: "How many days are between two dates?", a: "Enter both dates in difference mode. The calculator subtracts the start date from the end date and shows the total number of days, plus weeks and weekdays. Turn on “Include end date” if the last day should be counted as well." },
        { q: "Does the calculator include leap years?", a: "Yes. It uses the real calendar, so 29 February is counted whenever it falls inside the span." },
        { q: "What does adding a month do on the 31st?", a: "If the next month has fewer days, the result is the last day of that month. For example, 31 January plus one month is 28 February, or 29 February in a leap year." },
        { q: "Are weekends and holidays excluded from the weekday count?", a: "Weekends are excluded because the weekday count only includes Monday to Friday. Public holidays are not excluded, because they vary by country, region and year." },
        { q: "Can I subtract a date from a later date?", a: "Order does not matter in difference mode. If the end date is earlier than the start date, the calculator swaps them for you and tells you it did." },
      ],
    },
  },
  Tool,
};

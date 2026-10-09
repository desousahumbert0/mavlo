import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "aspect-ratio-calculator",
    category: "calculators",
    glyph: "16:9",
    slugs: { en: "aspect-ratio-calculator" },
    texts: {
      en: {
        name: "Aspect Ratio Calculator",
        title: "Aspect Ratio Calculator: 16:9, 4:3, 1:1, 21:9 & Custom",
        metaDescription:
          "Calculate the width or height for any aspect ratio such as 16:9, 9:16, 4:3, 1:1 or 21:9, or find the ratio of any size. Includes a table of common sizes.",
        h1: "Aspect Ratio Calculator",
        tagline: "Find the matching height or width for a ratio, or the ratio of any size.",
      },
    },
    keywords: ["aspect ratio", "ratio", "16:9", "4:3", "1:1", "21:9", "9:16", "resolution", "screen size", "video size", "image dimensions", "scale", "proportion", "width height", "crop ratio"],
    related: ["image-resizer", "percentage-calculator", "length-converter"],
    flags: { new: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "The aspect ratio of an image, video or screen is the proportion between its width and its height, written as two numbers such as 16:9. This calculator answers the two questions that come up most often: what height goes with a given width for a chosen ratio (and the other way round), and what ratio does a given size have.",
        "Pick a common ratio such as 16:9, 9:16, 4:3, 1:1 or 21:9, or enter your own, then type a width or a height. The other side is calculated instantly, and a table lists matching sizes for the ratio you selected.",
      ],
      howTo: [
        "Choose a ratio from the buttons, or select Custom and enter your own two numbers.",
        "Type a width to get the height, or type a height to get the width. The value you type last is the one that stays fixed.",
        "Read the result and the table of common sizes for the same ratio.",
        "To find the ratio of an existing size, enter its width and height in the second box.",
      ],
      howItWorks: {
        paragraphs: [
          "A ratio w:h means that for every w units of width there are h units of height. To find the height for a known width, multiply the width by h and divide by w. To find the width for a known height, multiply the height by w and divide by h. A 1920 pixel wide picture at 16:9 is 1920 × 9 ÷ 16 = 1080 pixels high.",
          "To find the ratio of a size, divide both numbers by their greatest common divisor, the largest number that divides both exactly. 1920 and 1080 share a divisor of 120, which gives 16:9. When a size does not reduce to a tidy ratio, the calculator shows the decimal value (width divided by height) and the closest common ratio.",
          "Pixel sizes must be whole numbers, so a result such as 607.5 is shown with its rounded value. If you need exact pixels, adjust the width until the height comes out whole. Matching ratios is what keeps pictures from looking stretched when they are resized.",
        ],
        formula: "height = width × h ÷ w\nwidth = height × w ÷ h\nratio = width ÷ gcd : height ÷ gcd",
      },
      examples: [
        { title: "A video at 1280 pixels wide in 16:9", body: "The height is 1280 × 9 ÷ 16 = 720 pixels, so the size is 1280 × 720, known as HD." },
        { title: "A vertical story at 1080 pixels wide", body: "At 9:16 the height is 1080 × 16 ÷ 9 = 1920 pixels, the standard size for Stories, Reels and Shorts." },
        { title: "What ratio is 2560 × 1080?", body: "Both numbers divide by 40 to give 64:27, which is close to 21:9, so it is an ultrawide size." },
      ],
      useCases: [
        "Choosing the right size for video, thumbnails and social media images.",
        "Resizing or cropping a photo without distorting it.",
        "Working out screen, monitor and projector dimensions.",
        "Designing layouts, placeholders and responsive embeds that keep their proportions.",
      ],
      tips: [
        "Use the Image Resizer with the calculated size to change a picture without stretching it.",
        "In CSS the same ratio can be written as aspect-ratio: 16 / 9.",
      ],
      faqs: [
        { q: "What is an aspect ratio?", a: "It is the relationship between the width and the height of a picture or screen, written as width:height. A 16:9 screen is 16 units wide for every 9 units high." },
        { q: "How do I calculate the height from the width?", a: "Multiply the width by the second ratio number and divide by the first. For 16:9 and a width of 1920, the height is 1920 × 9 ÷ 16 = 1080." },
        { q: "How do I find the aspect ratio of an image?", a: "Divide its width and height by their greatest common divisor. For 1600 × 1200 that divisor is 400, so the ratio is 4:3. The second box does this for you." },
        { q: "Which aspect ratio should I use for social media?", a: "Square 1:1 and portrait 4:5 suit feed posts, 9:16 suits Stories, Reels, TikTok and Shorts, and 16:9 suits YouTube and most landscape video. Platforms change their rules, so check the current guidelines." },
        { q: "Why does my result have decimals?", a: "Not every width fits a ratio with a whole-number height. Round to the nearest pixel, or change the width until the height comes out whole." },
      ],
    },
  },
  Tool,
};

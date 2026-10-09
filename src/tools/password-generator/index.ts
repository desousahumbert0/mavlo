import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "password-generator",
    category: "generators",
    glyph: "•••",
    slugs: { en: "password-generator" },
    texts: {
      en: {
        name: "Password Generator",
        title: "Password Generator: Strong, Random & Secure Passwords",
        metaDescription:
          "Generate strong random passwords of 8 to 64 characters with uppercase, lowercase, numbers and symbols. See the strength in bits and copy with one click. Private.",
        h1: "Password Generator",
        tagline: "Strong random passwords, created on your device and never sent anywhere.",
      },
    },
    keywords: ["password", "generator", "random password", "strong password", "secure password", "passphrase", "generate password", "password creator", "wifi password", "pin"],
    related: ["qr-code-generator", "word-counter", "case-converter"],
    flags: { new: true, popular: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "A strong password is long, random and unique to each account. This generator creates exactly that: choose a length from 8 to 64 characters, pick which kinds of characters to include and press Generate. The new password appears at once together with a strength meter, and one click copies it to your clipboard.",
        "Passwords are created in your browser using the secure random number generator built into your device, the same source used by cryptographic software. Nothing is sent to our servers, logged or stored, so the password exists only on your screen until you close the page.",
      ],
      howTo: [
        "Move the slider to choose a length. For most accounts 16 characters or more is a good choice.",
        "Tick the types of characters you want: lowercase, uppercase, numbers and symbols.",
        "Press Generate for a new password at any time. Each press creates a completely new one.",
        "Check the strength meter, then press Copy and paste the password into your password manager or the sign-up form.",
      ],
      howItWorks: {
        paragraphs: [
          "Strength is measured in bits of entropy, which describes how many guesses an attacker would need. For a password made of random characters, entropy equals the length multiplied by the base-2 logarithm of the number of characters to choose from. Adding a character type enlarges that pool, and adding length multiplies it, which is why length matters most.",
          "Each character is picked with a uniform random choice that avoids modulo bias, and the password is guaranteed to include at least one character from every type you selected. The characters are then shuffled so the guaranteed ones are not always in the same position.",
          "As a rough guide, under 40 bits is weak, 60 bits resists casual attacks, and 80 bits or more is very strong even against dedicated hardware. Real security also depends on never reusing a password and on where it is stored. A password manager remembers long random passwords for you.",
        ],
        formula: "entropy (bits) = length × log2(size of character pool)\nexample: 16 characters from 87 symbols ≈ 103 bits",
      },
      examples: [
        { title: "A password for an email account", body: "Use 20 characters with all four types enabled. The strength is about 129 bits, far beyond what can be guessed, and a password manager can remember it." },
        { title: "A password you must type by hand", body: "Turn on “Avoid look-alike characters” so that I, l, 1, O, 0 and o are left out, and use 16 characters. It is much easier to read and type correctly." },
        { title: "A Wi-Fi network key", body: "Use 24 characters with letters and numbers only if some devices struggle with symbols, then share it with guests using a QR code." },
      ],
      useCases: [
        "Creating a unique password for every new online account.",
        "Replacing weak or reused passwords after a data breach.",
        "Generating a Wi-Fi key, a database password or an API secret.",
        "Making passwords for family members or a shared team account.",
      ],
      tips: [
        "Use a different password for every account, and store them in a reputable password manager.",
        "Turn on two-factor authentication wherever it is offered. It protects you even if a password leaks.",
      ],
      faqs: [
        { q: "Are the passwords really random and private?", a: "Yes. They are generated in your browser with the cryptographically secure random generator of your device. The password is never sent to or stored by this website." },
        { q: "How long should a password be?", a: "At least 12 characters for ordinary accounts and 16 or more for email, banking and anything that protects other accounts. Length adds more strength than clever symbols." },
        { q: "What do the strength labels mean?", a: "They are based on bits of entropy: below 28 is very weak, 28 to 40 weak, 40 to 60 fair, 60 to 80 strong and 80 or more very strong. They assume the password is random and not reused." },
        { q: "Why must I include at least one character type?", a: "A password needs characters to be built from. If you untick everything the tool keeps the last type selected so that it can always create a password." },
        { q: "Is it safe to use a generated password for important accounts?", a: "Yes, and it is recommended, as long as you store it safely, for instance in a password manager, and do not reuse it elsewhere." },
      ],
    },
  },
  Tool,
};

import assert from "node:assert/strict";
import test from "node:test";
import { addDays, addMonths, daysBetween, diffYMD, nextBirthday, parseISODate, toISO, weekdayName, weekdaysInSpan } from "@/lib/date";
import { formatBytes, formatNumber, parseNumber } from "@/lib/format";
import { changeByPercent, percentChange, percentOf, whatPercent, wholeFromPart } from "@/lib/percent";
import { contrastRatio, emailPayload, phonePayload, vcardPayload, wifiPayload } from "@/lib/qr-data";
import { analyzeText } from "@/lib/text-stats";
import { convert, findUnit, lengthUnits, weightUnits } from "@/lib/units";
import { createZip, uniqueNames } from "@/lib/zip";

const d = (s: string) => parseISODate(s)!;

test("age: complete years, months and days", () => {
  assert.deepEqual(diffYMD(d("1990-03-15"), d("2024-05-20")), { years: 34, months: 2, days: 5 });
  assert.deepEqual(diffYMD(d("1990-03-15"), d("2024-03-15")), { years: 34, months: 0, days: 0 });
  assert.deepEqual(diffYMD(d("1990-03-15"), d("2024-03-16")), { years: 34, months: 0, days: 1 });
  assert.deepEqual(diffYMD(d("2000-01-31"), d("2000-03-01")), { years: 0, months: 1, days: 1 });
});

test("age: total days include leap days", () => {
  assert.equal(daysBetween(d("2024-01-01"), d("2024-12-31")), 365);
  assert.equal(daysBetween(d("2023-01-01"), d("2023-12-31")), 364);
  assert.equal(daysBetween(d("1990-03-15"), d("2024-05-20")), 12485);
});

test("date: add months clamps to end of month", () => {
  assert.equal(toISO(addMonths(d("2024-01-31"), 1)), "2024-02-29");
  assert.equal(toISO(addMonths(d("2023-01-31"), 1)), "2023-02-28");
  assert.equal(toISO(addMonths(d("2024-03-31"), -1)), "2024-02-29");
  assert.equal(toISO(addDays(d("2026-10-15"), 90)), "2027-01-13");
  assert.equal(weekdayName(d("2027-01-13")), "Wednesday");
});

test("date: next birthday and weekdays", () => {
  assert.equal(toISO(nextBirthday(d("1990-03-15"), d("2024-05-20"))), "2025-03-15");
  assert.equal(toISO(nextBirthday(d("1990-03-15"), d("2024-03-15"))), "2024-03-15");
  assert.equal(weekdaysInSpan(d("2024-01-01"), 7), 5);
  assert.equal(weekdaysInSpan(d("2024-01-06"), 2), 0);
});

test("percentages", () => {
  assert.equal(percentOf(15, 48.6), 7.29);
  assert.equal(whatPercent(30, 120), 25);
  assert.equal(whatPercent(1, 0), null);
  assert.equal(percentChange(80, 92), 15);
  assert.equal(percentChange(0, 5), null);
  assert.equal(changeByPercent(250, 20, -1), 200);
  assert.equal(wholeFromPart(30, 12), 250);
});

test("unit conversion uses exact factors", () => {
  const cm = findUnit(lengthUnits, "cm")!;
  const inch = findUnit(lengthUnits, "in")!;
  assert.ok(Math.abs(convert(2.54, cm, inch) - 1) < 1e-12);
  const mi = findUnit(lengthUnits, "mi")!;
  const km = findUnit(lengthUnits, "km")!;
  assert.ok(Math.abs(convert(1, mi, km) - 1.609344) < 1e-12);
  const kg = findUnit(weightUnits, "kg")!;
  const lb = findUnit(weightUnits, "lb")!;
  assert.ok(Math.abs(convert(1, lb, kg) - 0.45359237) < 1e-12);
  assert.ok(Math.abs(convert(70, kg, lb) - 154.3236) < 1e-3);
  assert.equal(new Set([...lengthUnits, ...weightUnits].map((u) => u.id)).size, lengthUnits.length + weightUnits.length);
});

test("number parsing and formatting", () => {
  assert.equal(parseNumber("12.5"), 12.5);
  assert.equal(parseNumber("12,5"), 12.5);
  assert.equal(parseNumber(""), null);
  assert.equal(parseNumber("abc"), null);
  assert.equal(formatNumber(1 / 3).length > 3, true);
  assert.equal(formatBytes(1536), "1.5 KB");
});

test("text statistics", () => {
  const s = analyzeText("Hello world. It's a well-known test!\n\nSecond paragraph here?");
  assert.equal(s.words, 9);
  assert.equal(s.sentences, 3);
  assert.equal(s.paragraphs, 2);
  assert.equal(analyzeText("").words, 0);
  assert.equal(analyzeText("😀 é").characters, 3);
  assert.equal(analyzeText("a b").charactersNoSpaces, 2);
});

test("QR payloads", () => {
  assert.equal(wifiPayload({ ssid: "My;Net", password: "p:w", security: "WPA", hidden: false }), "WIFI:T:WPA;S:My\\;Net;P:p\\:w;;");
  assert.equal(wifiPayload({ ssid: "Open", password: "", security: "nopass", hidden: true }), "WIFI:T:nopass;S:Open;H:true;;");
  assert.equal(emailPayload({ to: "a@b.com", subject: "Hi there", body: "" }), "mailto:a@b.com?subject=Hi%20there");
  assert.equal(phonePayload("+1 (555) 123-4567"), "tel:+15551234567");
  assert.match(vcardPayload({ first: "Ada", last: "Lovelace", org: "", phone: "", email: "", url: "" }), /^BEGIN:VCARD\nVERSION:3.0\nN:Lovelace;Ada;;;\nFN:Ada Lovelace\nEND:VCARD$/);
  assert.equal(vcardPayload({ first: "", last: "", org: "", phone: "1", email: "", url: "" }), "");
  assert.ok(contrastRatio("#000000", "#ffffff") > 20);
});

test("zip writer produces a valid archive", async () => {
  const zip = createZip([
    { name: "a.txt", data: new TextEncoder().encode("hello") },
    { name: "b.txt", data: new TextEncoder().encode("world") },
  ]);
  const { writeFileSync, mkdtempSync, readFileSync } = await import("node:fs");
  const { execFileSync } = await import("node:child_process");
  const { tmpdir } = await import("node:os");
  const dir = mkdtempSync(`${tmpdir()}/zip-`);
  writeFileSync(`${dir}/t.zip`, zip);
  try {
    execFileSync("unzip", ["-tq", `${dir}/t.zip`]);
    execFileSync("unzip", ["-oq", `${dir}/t.zip`, "-d", dir]);
    assert.equal(readFileSync(`${dir}/a.txt`, "utf8"), "hello");
    assert.equal(readFileSync(`${dir}/b.txt`, "utf8"), "world");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return; // unzip not installed
    throw e;
  }
  assert.deepEqual(uniqueNames(["a.jpg", "a.jpg", "b.jpg"]), ["a.jpg", "a-2.jpg", "b.jpg"]);
});

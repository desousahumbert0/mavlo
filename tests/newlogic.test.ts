import assert from "node:assert/strict";
import test from "node:test";
import { estimateMp3Bytes, floatToInt16, mp3Channels } from "@/lib/audio";
import { closestCommonRatio, heightFor, simplifyRatio, widthFor } from "@/lib/aspect";
import { CASES, caseWords, toCamel, toKebab, toPascal, toSentence, toSnake, toTitle } from "@/lib/case";
import { jpegOrientation } from "@/lib/jpeg";
import { activeSets, generatePassword, poolSize, secureRandomInt, strengthOf, type PasswordOptions } from "@/lib/password";
import { layoutImage } from "@/lib/pdf-layout";

const all: PasswordOptions = { length: 16, lower: true, upper: true, numbers: true, symbols: true, excludeAmbiguous: false };

test("passwords: length, character groups and uniqueness", () => {
  for (let i = 0; i < 200; i++) {
    const p = generatePassword({ ...all, length: 8 });
    assert.equal(p.length, 8);
    assert.match(p, /[a-z]/);
    assert.match(p, /[A-Z]/);
    assert.match(p, /[0-9]/);
    assert.match(p, /[^a-zA-Z0-9]/);
  }
  assert.equal(generatePassword({ ...all, length: 64 }).length, 64);
  assert.notEqual(generatePassword(all), generatePassword(all));
  assert.match(generatePassword({ ...all, symbols: false, upper: false, numbers: false, length: 30 }), /^[a-z]{30}$/);
  assert.doesNotMatch(generatePassword({ ...all, symbols: false, excludeAmbiguous: true, length: 64 }), /[Il1O0o]/);
  assert.throws(() => generatePassword({ ...all, lower: false, upper: false, numbers: false, symbols: false }));
});

test("passwords: random integers are in range and roughly uniform", () => {
  const counts = new Array(6).fill(0);
  for (let i = 0; i < 6000; i++) counts[secureRandomInt(6)]++;
  for (const c of counts) assert.ok(c > 800 && c < 1200, counts.join());
  assert.throws(() => secureRandomInt(0));
});

test("passwords: strength follows entropy", () => {
  assert.equal(poolSize(all), 26 + 26 + 10 + 25);
  assert.equal(activeSets({ ...all, symbols: false, excludeAmbiguous: true }).join("").includes("l"), false);
  assert.equal(strengthOf(4, 10).label, "Very weak");
  assert.equal(strengthOf(8, poolSize(all)).label, "Fair");
  assert.equal(strengthOf(16, poolSize(all)).label, "Very strong");
  assert.equal(strengthOf(12, 1).bits, 0);
});

test("case conversion", () => {
  assert.equal(toTitle("the lord of the rings: an UNEXPECTED journey"), "The Lord of the Rings: An Unexpected Journey");
  assert.equal(toTitle("it's a well-known fact"), "It's a Well-Known Fact");
  assert.equal(toSentence("HELLO world. how are you? fine!\nthanks"), "Hello world. How are you? Fine!\nThanks");
  assert.equal(toCamel("Hello big_wide-world"), "helloBigWideWorld");
  assert.equal(toPascal("hello big wide world"), "HelloBigWideWorld");
  assert.equal(toKebab("Hello Big World!"), "hello-big-world");
  assert.equal(toSnake("helloBigWorld"), "hello_big_world");
  assert.deepEqual(caseWords("XMLHttpRequest"), ["XML", "Http", "Request"]);
  assert.equal(toCamel("ÉCOLE élémentaire"), "écoleÉlémentaire");
  assert.equal(toCamel(""), "");
  assert.equal(CASES.length, 8);
});

test("aspect ratios", () => {
  assert.deepEqual(simplifyRatio(1920, 1080), [16, 9]);
  assert.deepEqual(simplifyRatio(1000, 1000), [1, 1]);
  assert.equal(simplifyRatio(10.5, 3), null);
  assert.equal(heightFor(1920, 16, 9), 1080);
  assert.equal(widthFor(1080, 9, 16), 607.5);
  assert.equal(closestCommonRatio(3840, 2160)?.ratio.label, "16:9");
  assert.equal(closestCommonRatio(3840, 2160)?.exact, true);
  assert.equal(closestCommonRatio(1000, 700)?.exact, false);
  assert.equal(closestCommonRatio(0, 5), null);
});

test("PDF page layout", () => {
  const fit = layoutImage(800, 600, "fit", "none");
  assert.deepEqual([fit.pageW, fit.pageH, fit.x, fit.y], [600, 450, 0, 0]);
  const a4 = layoutImage(1000, 1000, "a4", "none");
  assert.ok(Math.abs(a4.width - 595.28) < 1e-9 && Math.abs(a4.y - (841.89 - 595.28) / 2) < 1e-9);
  const land = layoutImage(2000, 1000, "letter", "medium");
  assert.equal(land.pageW, 792);
  assert.equal(land.pageH, 612);
  assert.ok(land.x >= 36 && land.y >= 36 && land.x + land.width <= 792 - 36 + 1e-9);
});

function exifJpeg(orientation: number, little: boolean): Uint8Array {
  const w16 = (v: number) => (little ? [v & 255, v >> 8] : [v >> 8, v & 255]);
  const w32 = (v: number) => (little ? [v & 255, (v >> 8) & 255, (v >> 16) & 255, v >>> 24] : [v >>> 24, (v >> 16) & 255, (v >> 8) & 255, v & 255]);
  const tiff = [...(little ? [0x49, 0x49] : [0x4d, 0x4d]), ...w16(42), ...w32(8), ...w16(1), ...w16(0x0112), ...w16(3), ...w32(1), ...w16(orientation), 0, 0, ...w32(0)];
  const body = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff];
  const len = body.length + 2;
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, len >> 8, len & 255, ...body, 0xff, 0xda, 0, 2, 0, 0]);
}

test("JPEG EXIF orientation", () => {
  for (const o of [1, 3, 6, 8]) {
    assert.equal(jpegOrientation(exifJpeg(o, true)), o);
    assert.equal(jpegOrientation(exifJpeg(o, false)), o);
  }
  assert.equal(jpegOrientation(new Uint8Array([0xff, 0xd8, 0xff, 0xda, 0, 2, 0, 0])), 1);
  assert.equal(jpegOrientation(new Uint8Array([1, 2, 3, 4, 5])), 1);
  assert.equal(jpegOrientation(new Uint8Array(0)), 1);
});

test("audio sample conversion", () => {
  assert.deepEqual(Array.from(floatToInt16(new Float32Array([0, 1, -1, 2, -2, 0.5]))), [0, 32767, -32768, 32767, -32768, 16384]);
  assert.equal(mp3Channels(1), 1);
  assert.equal(mp3Channels(6), 2);
  assert.equal(estimateMp3Bytes(60, 128), 960000);
});

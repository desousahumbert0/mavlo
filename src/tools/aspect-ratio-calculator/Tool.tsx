"use client";

import { useState } from "react";
import { COMMON_RATIOS, closestCommonRatio, heightFor, simplifyRatio, widthFor } from "@/lib/aspect";
import { formatNumber, parseNumber } from "@/lib/format";

const SIZES = [320, 640, 1280, 1920, 2560, 3840];
const CUSTOM = "custom";

const show = (n: number) => `${formatNumber(Math.round(n * 100) / 100, 8)}`;

export default function AspectRatioCalculator() {
  const [ratioId, setRatioId] = useState("16:9");
  const [cw, setCw] = useState("16");
  const [ch, setCh] = useState("9");
  const [value, setValue] = useState("1920");
  const [from, setFrom] = useState<"width" | "height">("width");
  const [fw, setFw] = useState("1920");
  const [fh, setFh] = useState("1080");

  const preset = COMMON_RATIOS.find((r) => r.label === ratioId);
  const rw = preset ? preset.w : parseNumber(cw);
  const rh = preset ? preset.h : parseNumber(ch);
  const ratioOk = rw !== null && rh !== null && rw > 0 && rh > 0;
  const v = parseNumber(value);
  const valueOk = v !== null && v > 0;

  let width: number | null = null;
  let height: number | null = null;
  if (ratioOk && valueOk) {
    if (from === "width") {
      width = v;
      height = heightFor(v, rw, rh);
    } else {
      height = v;
      width = widthFor(v, rw, rh);
    }
  }

  const fwn = parseNumber(fw);
  const fhn = parseNumber(fh);
  const found = fwn && fhn && fwn > 0 && fhn > 0 ? { simple: simplifyRatio(fwn, fhn), decimal: fwn / fhn, closest: closestCommonRatio(fwn, fhn) } : null;

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="ar-calc">
        <h3 id="ar-calc" className="font-semibold">
          Calculate a size from a ratio
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Aspect ratio">
          <div className="seg flex-wrap">
            {COMMON_RATIOS.map((r) => (
              <button key={r.label} type="button" aria-pressed={ratioId === r.label} onClick={() => setRatioId(r.label)} title={r.note}>
                {r.label}
              </button>
            ))}
            <button type="button" aria-pressed={ratioId === CUSTOM} onClick={() => setRatioId(CUSTOM)}>
              Custom
            </button>
          </div>
        </div>
        {preset && <p className="text-sm text-muted">{preset.note}</p>}
        {ratioId === CUSTOM && (
          <div className="grid max-w-sm grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="ar-cw">
                Ratio width
              </label>
              <input id="ar-cw" className="input" inputMode="decimal" value={cw} onChange={(e) => setCw(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="ar-ch">
                Ratio height
              </label>
              <input id="ar-ch" className="input" inputMode="decimal" value={ch} onChange={(e) => setCh(e.target.value)} />
            </div>
          </div>
        )}
        {!ratioOk && <p className="alert-error">Enter two numbers greater than zero for the ratio.</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ar-width">
              Width
            </label>
            <input
              id="ar-width"
              className="input"
              inputMode="decimal"
              value={from === "width" ? value : width !== null ? show(width) : ""}
              onChange={(e) => {
                setFrom("width");
                setValue(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="label" htmlFor="ar-height">
              Height
            </label>
            <input
              id="ar-height"
              className="input"
              inputMode="decimal"
              value={from === "height" ? value : height !== null ? show(height) : ""}
              onChange={(e) => {
                setFrom("height");
                setValue(e.target.value);
              }}
            />
          </div>
        </div>
        {width !== null && height !== null && (
          <div className="rounded-xl border border-brand/40 bg-brand/5 p-4" aria-live="polite">
            <p className="text-3xl font-bold tabular-nums sm:text-4xl">
              {show(width)} × {show(height)}
            </p>
            {(!Number.isInteger(width) || !Number.isInteger(height)) && (
              <p className="mt-1 text-sm text-muted">
                Rounded to whole pixels: {formatNumber(Math.round(width))} × {formatNumber(Math.round(height))}
              </p>
            )}
          </div>
        )}
        {ratioOk && (
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Common sizes for this ratio</caption>
              <thead className="bg-bg text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Width
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Height
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => {
                  const hh = heightFor(s, rw, rh);
                  return (
                    <tr key={s} className="border-t border-line">
                      <td className="px-3 py-2 tabular-nums">{formatNumber(s)}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {Number.isInteger(hh) ? formatNumber(hh) : `${formatNumber(Math.round(hh))} (≈ ${show(hh)})`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4 border-t border-line pt-6" aria-labelledby="ar-find">
        <h3 id="ar-find" className="font-semibold">
          Find the ratio of a size
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ar-fw">
              Width
            </label>
            <input id="ar-fw" className="input" inputMode="decimal" value={fw} onChange={(e) => setFw(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ar-fh">
              Height
            </label>
            <input id="ar-fh" className="input" inputMode="decimal" value={fh} onChange={(e) => setFh(e.target.value)} />
          </div>
        </div>
        <div aria-live="polite">
          {!found && <p className="text-muted">Enter a width and a height greater than zero.</p>}
          {found && (
            <div className="rounded-xl border border-line p-4">
              <p className="text-2xl font-bold tabular-nums">{found.simple ? `${found.simple[0]}:${found.simple[1]}` : "Not a whole-number size"}</p>
              <p className="mt-1 text-sm text-muted">
                Decimal: {found.decimal.toFixed(4)}
                {found.closest && (found.closest.exact ? ` · matches the common ratio ${found.closest.ratio.label}` : ` · closest common ratio: ${found.closest.ratio.label}`)}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

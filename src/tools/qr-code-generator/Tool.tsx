"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadBlob } from "@/lib/download";
import { contrastRatio, emailPayload, phonePayload, vcardPayload, wifiPayload, type WifiSecurity } from "@/lib/qr-data";

type Kind = "text" | "wifi" | "email" | "phone" | "contact";
type Level = "L" | "M" | "Q" | "H";

const KINDS: { id: Kind; label: string }[] = [
  { id: "text", label: "Link or text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "contact", label: "Contact" },
];

function Field({ id, label, value, onChange, type = "text", placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} className="input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function QrCodeGenerator() {
  const [kind, setKind] = useState<Kind>("text");
  const [text, setText] = useState("https://");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [security, setSecurity] = useState<WifiSecurity>("WPA");
  const [hidden, setHidden] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [phone, setPhone] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [org, setOrg] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [level, setLevel] = useState<Level>("M");
  const [size, setSize] = useState(600);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    switch (kind) {
      case "text":
        return text.trim() === "https://" ? "" : text;
      case "wifi":
        return ssid ? wifiPayload({ ssid, password: wifiPass, security, hidden }) : "";
      case "email":
        return mailTo ? emailPayload({ to: mailTo, subject: mailSubject, body: mailBody }) : "";
      case "phone":
        return phonePayload(phone);
      case "contact":
        return vcardPayload({ first, last, org, phone: cPhone, email: cEmail, url: cUrl });
    }
  }, [kind, text, ssid, wifiPass, security, hidden, mailTo, mailSubject, mailBody, phone, first, last, org, cPhone, cEmail, cUrl]);

  useEffect(() => {
    if (!payload) {
      setPng("");
      setSvg("");
      setError("");
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const opts = { errorCorrectionLevel: level, margin: 4, color: { dark: fg, light: bg } };
        const [dataUrl, svgText] = await Promise.all([QRCode.toDataURL(payload, { ...opts, width: size }), QRCode.toString(payload, { ...opts, type: "svg" })]);
        if (cancelled) return;
        setPng(dataUrl);
        setSvg(svgText);
        setError("");
      } catch {
        if (cancelled) return;
        setPng("");
        setSvg("");
        setError("There is too much content for a QR code. Shorten the text or lower the error correction level.");
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [payload, level, size, fg, bg]);

  const contrast = contrastRatio(fg, bg);
  const inverted = fg.toLowerCase() !== bg.toLowerCase() && contrastRatio(fg, "#000000") < contrastRatio(bg, "#000000");

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <div className="seg flex-wrap" role="group" aria-label="QR code content">
          {KINDS.map((k) => (
            <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>

        {kind === "text" && (
          <div>
            <label className="label" htmlFor="qr-text">
              Link or text
            </label>
            <textarea id="qr-text" className="input min-h-[110px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
          </div>
        )}
        {kind === "wifi" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="qr-ssid" label="Network name (SSID)" value={ssid} onChange={setSsid} />
            <Field id="qr-wpass" label="Password" value={wifiPass} onChange={setWifiPass} />
            <div>
              <label className="label" htmlFor="qr-sec">
                Security
              </label>
              <select id="qr-sec" className="input" value={security} onChange={(e) => setSecurity(e.target.value as WifiSecurity)}>
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--brand))]" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
              Hidden network
            </label>
          </div>
        )}
        {kind === "email" && (
          <div className="grid gap-3">
            <Field id="qr-mto" label="Email address" type="email" value={mailTo} onChange={setMailTo} />
            <Field id="qr-msub" label="Subject (optional)" value={mailSubject} onChange={setMailSubject} />
            <div>
              <label className="label" htmlFor="qr-mbody">
                Message (optional)
              </label>
              <textarea id="qr-mbody" className="input min-h-[80px]" value={mailBody} onChange={(e) => setMailBody(e.target.value)} />
            </div>
          </div>
        )}
        {kind === "phone" && <Field id="qr-phone" label="Phone number" type="tel" value={phone} onChange={setPhone} placeholder="+1 555 123 4567" />}
        {kind === "contact" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="qr-first" label="First name" value={first} onChange={setFirst} />
            <Field id="qr-last" label="Last name" value={last} onChange={setLast} />
            <Field id="qr-org" label="Company" value={org} onChange={setOrg} />
            <Field id="qr-cphone" label="Phone" type="tel" value={cPhone} onChange={setCPhone} />
            <Field id="qr-cemail" label="Email" type="email" value={cEmail} onChange={setCEmail} />
            <Field id="qr-curl" label="Website" value={cUrl} onChange={setCUrl} />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="label" htmlFor="qr-level">
              Error correction
            </label>
            <select id="qr-level" className="input" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="qr-size">
              PNG size
            </label>
            <select id="qr-size" className="input" value={size} onChange={(e) => setSize(Number(e.target.value))}>
              {[300, 600, 1000, 2000].map((s) => (
                <option key={s} value={s}>
                  {s} × {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="qr-fg">
              Code colour
            </label>
            <input id="qr-fg" type="color" className="input h-11 p-1" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="qr-bg">
              Background
            </label>
            <input id="qr-bg" type="color" className="input h-11 p-1" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
        {(contrast < 3 || inverted) && (
          <p className="alert-error" role="alert">
            {inverted ? "Light-on-dark codes fail on many scanners. Use a dark code on a light background." : "Low contrast: this code may be hard to scan. Choose colours that differ more."}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-line bg-white p-2" aria-live="polite">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt="Generated QR code preview" className="h-full w-full object-contain" width={280} height={280} />
          ) : (
            <p className="px-4 text-center text-sm text-neutral-500">{error || "Fill in the fields to see your QR code."}</p>
          )}
        </div>
        {error && png === "" && payload && (
          <p className="alert-error" role="alert">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-primary" disabled={!png} onClick={() => fetch(png).then((r) => r.blob()).then((b) => downloadBlob(b, "qr-code.png"))}>
            Download PNG
          </button>
          <button type="button" className="btn" disabled={!svg} onClick={() => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg")}>
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}

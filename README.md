# Mavlo — plataforma global de herramientas online

> **Mavlo es un nombre provisional.** Para renombrar el proyecto cambia `name` en `src/config/site.ts` y las menciones de marca en `src/content/legal.ts` (usan `siteConfig.name`) y en `src/app/icon.svg` si quieres otro icono.

Plataforma de herramientas gratuitas pensada para tráfico orgánico internacional, monetizable con Google AdSense (desactivado por defecto) y preparada para crecer a cientos de herramientas e idiomas sin rehacer nada.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Vercel · sin base de datos.

## Estado de la Fase 1

Las 10 herramientas funcionan 100 % en el navegador (nada se sube a ningún servidor):

| Herramienta | Categoría | Notas técnicas |
|---|---|---|
| Age Calculator | Calculators | Aritmética de calendario exacta (sin zonas horarias) |
| Date Calculator | Calculators | Diferencia entre fechas, días laborables, sumar/restar |
| Percentage Calculator | Calculators | 5 cálculos en un solo lugar |
| Word Counter | Text Tools | Palabras, caracteres, tiempo de lectura, límites, densidad |
| Length Converter | Converters | Motor genérico `UnitConverter` + atajos `?from=cm&to=in` |
| Weight Converter | Converters | Mismo motor; factores exactos |
| Image Compressor | Image Tools | Canvas del navegador; JPG/PNG/WebP; ZIP propio sin dependencias |
| HEIC to JPG | Image Tools | `heic2any` cargado solo al pulsar «Convertir» (~1 MB) |
| QR Code Generator | Generators | `qrcode` cargado bajo demanda; PNG y SVG; Wi-Fi, email, vCard… |
| Merge PDF | PDF Tools | `pdf-lib` cargado bajo demanda; reordenar, contar páginas |

Además: home, página «All tools», 6 páginas de categoría, buscador interno, 5 páginas legales (About, Privacy, Terms, Cookies, Contact), 404, sitemap, robots, JSON-LD, Open Graph dinámico, i18n preparada y huecos de AdSense apagados.

> **Importante:** el entorno donde se escribió este proyecto no tenía acceso a internet, así que **no se pudo ejecutar `npm install` ni `next build`**. Lo que sí se ejecutó y pasa: la lógica pura (fechas, unidades, porcentajes, QR, ZIP, búsqueda, sitemap), la puerta anti-thin-content, y el renderizado en servidor de las 10 herramientas (`npm test`). La primera vez que lo ejecutes, haz esto en orden y corrige lo que salga:
> `npm install` → `npm run typecheck` → `npm test` → `npm run build`.

## Ejecutar en local

Requisitos: Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local     # opcional, los valores por defecto sirven para desarrollar
npm run dev                    # http://localhost:3000  → redirige a /en
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (ejecuta además la puerta anti-thin-content) |
| `npm start` | Sirve el build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint de Next |
| `npm test` | Tests de lógica, de contenido/SEO y renderizado de herramientas |

## Estructura

```
src/
  app/
    [locale]/                 # todo cuelga del idioma: /en/...
      layout.tsx              # <html lang>, header, footer, analytics
      page.tsx                # home
      tools/page.tsx          # /en/tools  (todas las herramientas)
      tools/[slug]/page.tsx   # plantilla ÚNICA de herramienta
      [category]/page.tsx     # /en/calculators, /en/converters ...
      about|privacy|terms|cookies|contact/page.tsx
      not-found.tsx
    api/og/route.tsx          # imagen Open Graph dinámica (edge)
    sitemap.ts · robots.ts · icon.svg · globals.css
  tools/
    registry.ts               # ← ÚNICA lista de herramientas
    types.ts                  # contrato ToolModule
    <slug>/index.ts           # metadatos + contenido SEO de la herramienta
    <slug>/Tool.tsx           # la interfaz y su lógica (client component)
  components/                 # Header, Footer, SearchBox, ToolCard, AdSlot, JsonLd, Breadcrumbs, ui/*
  config/                     # site.ts, ads.ts, categories.ts
  content/legal.ts            # textos legales por idioma
  i18n/                       # config.ts (idiomas), dictionary.ts, dictionaries/en.ts
  lib/                        # lógica pura y testeada: date, units, percent, text-stats, qr-data, image, zip, seo, search, quality
tests/                        # node:test + tsx
```

### Decisiones de arquitectura (y por qué)

- **Todo estático (SSG).** Cada página se genera en build: HTML completo para Google, TTFB mínimo, coste de servidor ≈ 0. No hay base de datos ni API, salvo la imagen OG.
- **Una plantilla, N herramientas.** Metadata, JSON-LD, breadcrumbs, FAQ, enlaces relacionados, sitemap, búsqueda y anuncios se generan desde el registro. Añadir una herramienta no toca la plantilla.
- **JS mínimo.** Las páginas son Server Components; solo `Tool.tsx` y el buscador son cliente. Las librerías pesadas (`pdf-lib`, `heic2any`, `qrcode`) se importan dinámicamente dentro de los manejadores, así que solo se descargan cuando el usuario las usa.
- **Sin dependencias de UI, búsqueda ni ZIP.** Buscador propio (~60 líneas), escritor ZIP propio, sin librería de componentes. Dependencias de runtime: `next`, `react`, `react-dom`, `pdf-lib`, `qrcode`, `heic2any`.
- **Fuentes del sistema** (sin webfont) para el mejor LCP/CLS en móviles modestos.
- **Redirecciones en `next.config.ts`** (sin middleware): `/` → `/en` (307, sin autodetección por IP para no confundir a Google) y rutas sin idioma (`/tools/x`, `/converters`…) → `/en/...` (308).

## Añadir una herramienta nueva

1. Crea `src/tools/<slug>/` con dos archivos.

   `Tool.tsx` (interfaz, componente de cliente):

   ```tsx
   "use client";
   export default function MiHerramienta() {
     // estado con useState, lógica pura en src/lib/ (así se puede testear)
     return <div>…</div>;
   }
   ```

   `index.ts` (metadatos y contenido; copia uno existente como plantilla):

   ```ts
   import type { ToolModule } from "../types";
   import Tool from "./Tool";

   export const tool: ToolModule = {
     config: {
       id: "mi-herramienta",            // = slug en inglés, no se cambia nunca
       category: "calculators",         // calculators | converters | image-tools | pdf-tools | text-tools | generators
       glyph: "Mi",
       slugs: { en: "mi-herramienta" },
       texts: { en: { name, title, metaDescription, h1, tagline } },
       keywords: ["sinónimos", "búsquedas típicas"],
       related: ["otra-herramienta", "y-otra"],   // mínimo 2, deben existir
       flags: { new: true },                      // popular | new | recommended
       updated: "2026-10-05",
     },
     content: { en: { intro, howTo, howItWorks, examples, useCases, tips, faqs } },
     Tool,
   };
   ```

2. Añádela al array de `src/tools/registry.ts` (una importación y una línea).
3. `npm test`. La **puerta anti-thin-content** (`src/lib/quality.ts`) falla si la herramienta no tiene ≥ 300 palabras de guía, ≥ 4 FAQ, ≥ 3 pasos, ≥ 2 ejemplos, ≥ 2 relacionadas válidas, meta description de 70–165 caracteres y título ≤ 64. Falla también el `next build` en producción: una página débil nunca llega a Google.

Para un conversor de unidades nuevo (área, volumen, velocidad, presión…): añade la tabla en `src/lib/units.ts` y el `Tool.tsx` es una línea con `<UnitConverter units={…} defaultFrom="…" defaultTo="…" />`.

**Atajos de búsqueda** (`presets` en `config`): entradas como «KG to Pounds» abren la herramienta con `?from=kg&to=lb`. No son páginas nuevas: evitan contenido duplicado. Crea una URL propia (`/en/convert/kg-to-lbs`) solo cuando una variante tenga contenido genuinamente distinto (tabla, ejemplos y FAQ propios).

## Añadir un idioma nuevo (ejemplo: español)

1. `src/i18n/config.ts`: `export const locales = ["en", "es"] as const;` (ya existen `localeNames` y `ogLocales` para es, fr, de, pt, it).
2. Copia `src/i18n/dictionaries/en.ts` a `es.ts`, traduce los textos y regístralo en `src/i18n/dictionary.ts` (`es: () => import("./dictionaries/es").then((m) => m.default)`).
3. `src/config/categories.ts`: añade `es: { slug, name, title, metaDescription, h1, blurb, intro, faqs }` a cada categoría.
4. Para cada herramienta que quieras publicar en español, añade en su `index.ts`: `slugs.es` (slug traducido, p. ej. `calculadora-de-edad`), `texts.es` y `content.es`. **Una herramienta solo se publica en los idiomas donde tiene slug + textos + contenido**, así nunca se generan páginas sin traducir.
5. `src/content/legal.ts`: añade el bloque `es`.
6. Las etiquetas dentro del `Tool.tsx` están hoy en inglés; para traducirlas, extrae los textos a un objeto `{ en: {…}, es: {…} }` dentro de cada herramienta y selecciónalo por idioma (las herramientas ya se renderizan por página/idioma).
7. `npm test && npm run build`. El sitemap, los `hreflang` (incluido `x-default` → `/en`) y los canonical se generan solos y de forma recíproca.

URLs resultantes: `/es/tools/calculadora-de-edad`. Se mantiene `tools` como segmento técnico en todos los idiomas y se traduce el slug de la herramienta.

## Metadata SEO: dónde se define cada cosa

| Elemento | Origen |
|---|---|
| `<title>`, meta description, H1 | `texts.<locale>` en el `index.ts` de la herramienta |
| Canonical, hreflang, Open Graph, Twitter | `src/lib/seo.ts` (`buildMetadata`) |
| JSON-LD (`WebApplication`, `FAQPage`, `BreadcrumbList`, `ItemList`, `WebSite`) | `src/lib/seo.ts` + `components/JsonLd.tsx` |
| Imagen social | `/api/og?title=…` (generada, cacheada) |
| Sitemap con alternates por idioma | `src/app/sitemap.ts` |
| Preview de Vercel no indexable | `layout.tsx` (`VERCEL_ENV=preview` → `noindex`) |

Buenas prácticas ya aplicadas: URLs limpias y planas (`/en/tools/<slug>`, no dependen de la categoría), sin barra final, canonical autorreferenciado, 404 real, sin duplicados.

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. En Vercel: **Add New → Project** → importa el repositorio. El preset Next.js se detecta solo.
3. Variables de entorno (Settings → Environment Variables), al menos:
   - `NEXT_PUBLIC_SITE_URL` = tu dominio final (`https://tudominio.com`)
   - `NEXT_PUBLIC_CONTACT_EMAIL` = tu correo real
4. Deploy. Después añade tu dominio en Settings → Domains.
5. En Google Search Console: añade la propiedad, verifica (puedes usar `NEXT_PUBLIC_GSC_VERIFICATION` con el valor de la metaetiqueta) y envía `https://tudominio.com/sitemap.xml`.

### Variables de entorno

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (canonical, sitemap, OG). En Vercel, si falta, usa el dominio de producción |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo mostrado en Contact / Privacy |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` para activar anuncios. **Por defecto `false`** |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_SLOT_BELOW_TOOL` / `_IN_CONTENT` / `_SIDEBAR` | IDs de bloque de anuncios |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (opcional) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Token de verificación de Search Console (opcional) |

## Activar AdSense más adelante

Mientras `NEXT_PUBLIC_ADS_ENABLED` no sea `true`, `AdSlot` no renderiza **nada** (ni marcado, ni espacio, ni JS).

1. Publica el sitio con contenido real y las páginas legales, y solicita el alta en AdSense.
2. Pon en `public/ads.txt` la línea que te dé Google (`google.com, pub-…, DIRECT, f08c47fec0942fa0`).
3. Cuando te aprueben, crea bloques de anuncios *display* adaptables y copia sus IDs.
4. En Vercel define `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_BELOW_TOOL`, `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT` y `NEXT_PUBLIC_ADS_ENABLED=true`, y vuelve a desplegar.
5. Los huecos están en `src/config/ads.ts`, cada uno activable por separado: `below-tool` (justo bajo la herramienta), `in-content` (tras los ejemplos) y `sidebar` (reservado, apagado). Cada hueco reserva su altura para no provocar CLS, y **nunca hay anuncios encima de la herramienta**.
6. **Consentimiento:** para visitantes del EEE, Reino Unido y Suiza, Google exige un CMP certificado (p. ej. el de Google en AdSense → Privacidad y mensajes). Configúralo antes de activar anuncios o Analytics, y actualiza `Privacy` y `Cookies` en `src/content/legal.ts`.

## Analytics y Search Console

- Google Analytics: define `NEXT_PUBLIC_GA_ID`. Se carga con `lazyOnload`, sin bloquear el render (aplica la misma nota de consentimiento).
- Search Console: `NEXT_PUBLIC_GSC_VERIFICATION` o verificación por DNS, y envío del sitemap.

## Antes de lanzar (checklist)

- [ ] `npm run typecheck && npm test && npm run build` sin errores.
- [ ] Correo de contacto real y texto legal revisado (`src/content/legal.ts` es un punto de partida, **no asesoría legal**; revísalo con un profesional antes de monetizar).
- [ ] Probar cada herramienta en un móvil real (sobre todo HEIC, Merge PDF e Image Compressor con archivos grandes).
- [ ] Lighthouse móvil en home y en 2-3 herramientas.
- [ ] Sitemap enviado y páginas principales inspeccionadas en Search Console.

## Límites conocidos

- Merge PDF no puede abrir PDFs con contraseña y no conserva marcadores/índices de los originales. Hay un límite práctico de memoria en móviles antiguos con lotes enormes.
- HEIC to JPG convierte solo la imagen principal (no Live Photos ni mapas de profundidad). La librería pesa ~1 MB y solo se descarga al convertir.
- Las URLs fuera de un idioma válido (`/xyz`) devuelven el 404 por defecto de Next, no el diseñado.
- El texto interno de las herramientas está en inglés hasta que se traduzcan (ver «Añadir un idioma», paso 6).
- La cabecera `Content-Security-Policy` no se incluye todavía: debe diseñarse junto con AdSense/Analytics.

## Roadmap

- **Fase 2 (30):** resto de conversores (Temperature, Area, Volume, Speed, Time, Data Storage, Pressure, Energy), BMI (con fuentes médicas), Discount, Tip, Image Resizer, JPG↔PNG, WebP→JPG, Split/Compress PDF, JPG→PDF, Case Converter, Remove Duplicate Lines, Password y UUID Generator. Reutilizan la plantilla y `UnitConverter`.
- **Fase 3 (100):** herramientas para desarrolladores (JSON, Base64, URL encode), diseño y color, finanzas, PDF avanzado, segundo idioma completo, Background Remover (modelo en el navegador) y primeras pruebas de funciones Pro.

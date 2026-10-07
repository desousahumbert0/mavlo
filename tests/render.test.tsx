import assert from "node:assert/strict";
import test from "node:test";
import { renderToString } from "react-dom/server";
import { tools } from "@/tools/registry";

// Server-render every tool once: catches broken imports, hook misuse and crashes in the initial render.
for (const tool of tools) {
  test(`renders ${tool.config.id} on the server without errors`, () => {
    const html = renderToString(<tool.Tool />);
    assert.ok(html.length > 200, "empty render");
    assert.ok(!html.includes("undefined"), "rendered the text 'undefined'");
    assert.ok(!html.includes("[object Object]"), "rendered an object");
  });
}

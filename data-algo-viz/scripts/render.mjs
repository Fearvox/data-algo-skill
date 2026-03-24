#!/usr/bin/env node
/**
 * Terminal renderer for data-algo-viz specs.
 *
 * Usage:
 *   node render.mjs <spec.json>
 *   echo '{"root":"...","elements":{...}}' | node render.mjs --stdin
 *
 * Reads a json-render spec and renders it in the terminal via ink.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import React from "react";
import { render } from "ink";
import { createRenderer, standardComponents } from "@json-render/ink";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/ink/schema";
import {
  standardComponentDefinitions,
  standardActionDefinitions,
} from "@json-render/ink/catalog";

// Set up the catalog with all standard ink components
const catalog = defineCatalog(schema, {
  components: standardComponentDefinitions,
  actions: standardActionDefinitions,
});

// Create the renderer
const InkRenderer = createRenderer(catalog, standardComponents);

// Parse input
let specJson;

if (process.argv.includes("--stdin")) {
  // Read from stdin
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  specJson = Buffer.concat(chunks).toString("utf-8");
} else if (process.argv[2]) {
  // Read from file
  const specPath = resolve(process.argv[2]);
  specJson = readFileSync(specPath, "utf-8");
} else {
  console.error("Usage: node render.mjs <spec.json> | node render.mjs --stdin");
  process.exit(1);
}

try {
  const spec = JSON.parse(specJson);

  // Validate basic spec structure
  if (!spec.root || !spec.elements) {
    console.error("Invalid spec: must have 'root' and 'elements' keys");
    process.exit(1);
  }

  // Create a fully mocked stdin for non-interactive (piped) rendering
  const mockStdin = new Readable({ read() {} });
  mockStdin.isTTY = true;
  mockStdin.setRawMode = () => mockStdin;
  mockStdin.ref = () => mockStdin;
  mockStdin.unref = () => mockStdin;

  // Render with mocked stdin so ink doesn't crash in non-TTY environments
  const { unmount } = render(
    React.createElement(InkRenderer, { spec, state: {} }),
    { stdin: mockStdin, exitOnCtrlC: false }
  );

  // Display for a moment then exit cleanly
  setTimeout(() => {
    unmount();
    process.exit(0);
  }, 300);
} catch (err) {
  console.error("Render error:", err.message);
  process.exit(1);
}

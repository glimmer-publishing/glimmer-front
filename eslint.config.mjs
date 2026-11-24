import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Layers, top to bottom. A slice imports only from layers below its own,
 * straight from the file that defines the name: there are no index.ts
 * barrels. See docs/architecture.md.
 */
const LAYERS = ["app", "views", "widgets", "features", "entities", "shared"];
const SLICED_LAYERS = ["views", "widgets", "features", "entities"];

/**
 * The rules for files in one layer: no upward imports, no other slice of the
 * same layer (inside a slice imports are relative), no legacy components.
 */
const layerRules = (layer) => {
  const index = LAYERS.indexOf(layer);
  const forbidden = LAYERS.slice(0, index);
  if (SLICED_LAYERS.includes(layer)) forbidden.push(layer);

  return {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...forbidden.map((other) => ({
              group: [`@/${other}`, `@/${other}/*`],
              message:
                other === layer
                  ? `A ${layer} slice cannot import another ${layer} slice; use relative imports inside a slice.`
                  : `${layer} cannot import from ${other}, a higher layer.`,
            })),
            {
              group: ["@/components", "@/components/*"],
              message:
                "The layered code never imports legacy src/components; duplicate it into shared/ui instead.",
            },
          ],
        },
      ],
    },
  };
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...SLICED_LAYERS.concat("shared").map(layerRules),
];

export default eslintConfig;

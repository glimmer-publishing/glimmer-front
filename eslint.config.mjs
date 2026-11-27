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
 * Entities may import each other's types, never their values: a type that
 * two entities share (Product in a category) belongs to the entity that owns
 * it, and `import type` is erased at build time, so no runtime coupling
 * appears. The TypeScript variant of the rule is what allows that.
 */
const layerRules = (layer) => {
  const index = LAYERS.indexOf(layer);
  const upward = LAYERS.slice(0, index);
  const sameLayer = SLICED_LAYERS.includes(layer) ? [layer] : [];

  return {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            ...upward.map((other) => ({
              group: [`@/${other}`, `@/${other}/*`],
              message: `${layer} cannot import from ${other}, a higher layer.`,
            })),
            ...sameLayer.map((other) => ({
              group: [`@/${other}`, `@/${other}/*`],
              message: `A ${layer} slice cannot import another ${layer} slice${
                layer === "entities" ? " (type-only imports are allowed)" : ""
              }; use relative imports inside a slice.`,
              allowTypeImports: layer === "entities",
            })),
            {
              group: ["@/components", "@/components/*"],
              message:
                "src/components no longer exists; put shared UI in shared/ui or the owning slice.",
            },
            {
              group: ["framer-motion", "framer-motion/*"],
              message:
                'framer-motion is only a dependency of motion: import from "motion/react" (client) or "motion/react-client" (server components).',
            },
          ],
        },
      ],
    },
  };
};

/**
 * Entities are domain data only: types, reads, stores, pure logic. Their
 * display lives in widgets and views, their user actions in features.
 */
const entitiesHaveNoUi = {
  files: ["src/entities/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXElement, JSXFragment",
        message:
          "Entities hold no UI: render in a widget or view, act in a feature.",
      },
    ],
  },
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...SLICED_LAYERS.concat("shared").map(layerRules),
  entitiesHaveNoUi,
];

export default eslintConfig;

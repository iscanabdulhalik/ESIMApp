module.exports = {
  extends: [
    "expo",
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    // React specific rules
    "react/prop-types": "off", // TypeScript handles this
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // General rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": "off", // Handled by TypeScript
    "prefer-const": "error",
    "no-var": "error",

    // Import rules
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es2021: true,
    node: true,
    "react-native/react-native": true,
  },
  ignorePatterns: [
    "node_modules/",
    "android/",
    "ios/",
    ".expo/",
    "dist/",
    "web-build/",
  ],
};
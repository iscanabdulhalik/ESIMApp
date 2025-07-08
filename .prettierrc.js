module.exports = {
  // Line formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  
  // String formatting
  singleQuote: false,
  quoteProps: "as-needed",
  
  // Object/Array formatting
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: "always",
  
  // File handling
  endOfLine: "lf",
  
  // React/JSX specific
  jsxSingleQuote: false,
  
  // Ignore patterns
  ignore: [
    "node_modules/**",
    "android/**",
    "ios/**", 
    ".expo/**",
    "dist/**",
    "web-build/**",
  ],
};
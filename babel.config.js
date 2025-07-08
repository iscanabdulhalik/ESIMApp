module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  // Bu satırı ekleyin:
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
  ],
};

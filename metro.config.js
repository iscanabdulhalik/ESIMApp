const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.resolver.platforms = ["ios", "android", "native", "web"];

// Cache configuration
config.cacheStores = [
  {
    name: "filesystem",
    type: "FileStore",
  },
];

// Transformer optimizations
config.transformer.enableBabelRuntime = false;
config.transformer.enableBabelRCLookup = false;

// Resolver optimizations
config.resolver.alias = {
  ...config.resolver.alias,
  // Add any custom aliases here
};

// Watchman configuration
config.watchFolders = [__dirname];

// Exclude unnecessary files from watching
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

// Asset extensions
config.resolver.assetExts.push(
  // Add any custom asset extensions
  "db",
  "mp3",
  "ttf",
  "obj",
  "png",
  "jpg"
);

module.exports = config;

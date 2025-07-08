const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Cache'i tamamen devre dışı bırak
config.cacheStores = [];

// Transformer optimizations
config.transformer.enableBabelRuntime = false;
config.transformer.enableBabelRCLookup = false;

// Resolver optimizations
config.resolver.platforms = ["ios", "android", "native", "web"];

// Watchman configuration - daha stabil
config.watchFolders = [__dirname];

// Exclude unnecessary files from watching
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

// Asset extensions
config.resolver.assetExts.push("db", "mp3", "ttf", "obj", "png", "jpg");

// Cache'i komple kapat
config.resetCache = true;

module.exports = config;

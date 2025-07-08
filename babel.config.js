module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Tüm ekstra plugin'leri kaldırdık
      // Sadece temel Expo preset kullanıyoruz
    ],
  };
};

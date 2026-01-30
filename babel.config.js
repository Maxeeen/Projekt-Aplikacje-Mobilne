module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Usunęliśmy plugins: ['react-native-reanimated/plugin']
  };
};
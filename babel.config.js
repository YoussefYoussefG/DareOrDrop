/**
 * Babel config for Dare or Drop
 *
 * babel-preset-expo handles all necessary transformations
 * including react-native-reanimated support.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};

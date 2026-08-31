const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /node_modules\/.*\/(android|ios|windows|macos)\/.*/,
  /node_modules\/.*\/(docs|doc|example|examples|__tests__|test|tests)\/.*/,
];

module.exports = config;

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config'); // Nếu dùng Expo
// const { getDefaultConfig } = require('metro-config'); // Nếu không dùng Expo

module.exports = getDefaultConfig(__dirname);

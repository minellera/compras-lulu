const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Permite que o Metro resolva .wasm como asset binário
// (necessário para expo-sqlite web/worker.ts → wa-sqlite.wasm)
config.resolver.assetExts.push('wasm');

module.exports = config;

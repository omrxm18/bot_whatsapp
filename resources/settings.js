const fs = require("fs");
const path = require("path");

const settingsPath = path.resolve(__dirname, "./settings.json");

function getSettings() {
  return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}

module.exports = getSettings();

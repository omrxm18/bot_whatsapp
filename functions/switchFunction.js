const fs = require("fs");
const path = require("path");
const contextInfo = require("../resources/costumase");
const { texts } = require("../resources/package");

const settingsPath = path.resolve(__dirname, "../resources/settings.json");

async function modeSwitcher(params, sock, msg) {
  try {
    // Read current settings from JSON (safe, no regex hacks)
    let settings;
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `${texts.errorOnSwicher}\n\n${texts.parramsNotFound}\n${texts.version}`,
        contextInfo,
      }, { quoted: msg });
    }

    if (!(params in settings)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `${texts.errorOnSwicher}\n\n${texts.parramsNotFound}\n${texts.version}`,
        contextInfo,
      }, { quoted: msg });
    }

    const currentValue = settings[params];
    const newValue = !currentValue;

    settings[params] = newValue;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");

    // Bust require cache so next require("settings.js") reads fresh values
    delete require.cache[require.resolve("../resources/settings.js")];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `${texts.modeSwitched}\n\n> *𝙼𝚘𝚍𝚎:* *${params}*\n> *𝙿𝚛𝚎𝚟𝚒𝚘𝚞𝚜 𝚜𝚝𝚊𝚝𝚞𝚜:* *${currentValue}*\n> *𝙽𝚎𝚠 𝚜𝚝𝚊𝚝𝚞𝚜:* *${newValue}*\n${texts.version}`,
      contextInfo,
    }, { quoted: msg });
  } catch (error) {
    console.error("modeSwitcher error:", error);
  }
}

module.exports = modeSwitcher;

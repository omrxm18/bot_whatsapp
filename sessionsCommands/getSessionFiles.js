const plugins = require("../resources/plugins.js");
const { texts, emojis } = require("../resources/package.js");
const contextInfo = require("../resources/costumase.js");

module.exports = {
  name: plugins.getFilesSessions.plug,
  description: plugins.getFilesSessions.desc,
  async execute(sock, msg, args, MyJid, sender, activeSessions, sessionsToNotReconnect, startBotInstance, pendingSessions, isSessionFolderEmpty) {
    try {
      if (!args || args.length !== 2) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: emojis.error, key: msg.key },
        });
        return;
      }

      const [newSessionName, phoneNumber] = args;

      if (activeSessions[newSessionName]) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `⚠️ Session already running: ${newSessionName.toUpperCase()}\n${texts.version}`,
          contextInfo,
        });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: emojis.loading, key: msg.key },
      });

      await startBotInstance(newSessionName, {
        authMethod: "code",
        phoneNumber,
        onCancel: async () => {
          await sock.sendMessage(msg.key.remoteJid, {
            text: `Session creation failed: ${newSessionName.toUpperCase()}\n${texts.version}`,
            contextInfo,
          });
        },
      });

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: emojis.done, key: msg.key },
      });
    } catch (error) {
      console.error("Error in getSessionFiles command:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: emojis.fail, key: msg.key },
      });
    }
  },
};

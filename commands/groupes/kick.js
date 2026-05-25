const plugins = require("../../resources/plugins.js");
const { texts, emojis } = require("../../resources/package.js");
const contextInfo = require("../../resources/costumase.js");
const updateKickedCount = require("../../functions/updateKick.js");

module.exports = {
  name: plugins.kickUser.plug,
  description: plugins.kickUser.desc,
  async execute(sock, msg, args, MyJid) {
    const settings = require("../../resources/settings.js");
    if (!msg.key.remoteJid.endsWith("@g.us")) return;
    try {
      const msgInfo = msg.message?.extendedTextMessage?.contextInfo;
      const mentions = msgInfo?.mentionedJid || [];
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const isAdmin = metadata.participants.some(
        (p) => p.id === msg.key.participant && (p.admin === "admin" || p.admin === "superadmin")
      );

      if (!isAdmin) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `${texts.notAdmin}\n${texts.version}`,
          contextInfo,
        }, { quoted: msg });
        return;
      }

      let targets = [];
      if (mentions.length > 0) {
        targets = mentions;
      } else if (msgInfo?.participant) {
        targets = [msgInfo.participant];
      }

      // Filter out the bot itself
      targets = targets.filter((id) => id !== MyJid.id && id !== MyJid.lid);
      if (targets.length === 0) return;

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: emojis.delete, key: msg.key },
      });
      await sock.groupParticipantsUpdate(msg.key.remoteJid, targets, "remove");
      await updateKickedCount(targets.length); // fixed: was counting string length before
    } catch (error) {
      console.error(error);
    }
  },
};

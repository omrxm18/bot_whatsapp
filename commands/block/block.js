const plugins = require("../../resources/plugins.js");
const { emojis } = require("../../resources/package.js");

async function blockUser(sock, msg, jid) {
  await sock.sendMessage(msg.key.remoteJid, {
    react: { text: emojis.done, key: msg.key },
  });
  await sock.updateBlockStatus(jid, "block");
}

module.exports = {
  name: plugins.blockUser.plug,
  description: plugins.blockUser.desc,
  async execute(sock, msg, args, MyJid) {
    const { texts } = require("../../resources/package.js");
    const contextInfo = require("../../resources/costumase.js");
    const settings = require("../../resources/settings.js");
    try {
      if (msg.key.remoteJid.endsWith("@g.us")) {
        const msgInfo = msg.message.extendedTextMessage?.contextInfo;
        const isReply = msgInfo?.quotedMessage;
        const mentions = msgInfo?.mentionedJid || [];

        if (isReply) {
          await blockUser(sock, msg, msgInfo.participant);
          return;
        }
        if (mentions.length === 1) {
          await blockUser(sock, msg, mentions[0]);
        }
        return;
      }
      await blockUser(sock, msg, msg.key.remoteJid);
    } catch (error) {
      console.error(error);
    }
  },
};

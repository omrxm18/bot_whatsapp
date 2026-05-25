const plugins = require("../../resources/plugins.js");
const { texts, emojis } = require("../../resources/package.js");
const contextInfo = require("../../resources/costumase.js");

async function checkIfLinked(sock, msg, jid, args, MyJid) {
  const privateSend = args.length === 1 && args[0] === "prv";
  const devices = await sock.getUSyncDevices([jid], true);
  const devicesLength = devices.length - 1;

  // Fixed: toJid was set to [] then assigned a string — now clean
  const toJid = privateSend && msg.key.remoteJid.endsWith("@g.us")
    ? MyJid.id
    : msg.key.remoteJid;

  await sock.sendMessage(toJid, {
    react: { text: emojis.link, key: msg.key },
  });
  await sock.sendMessage(toJid, {
    text: `*${texts.spyTitle}*\n> ${texts.linkedCheck}\n\n *𝚄𝚂𝙴𝚁 :* @${jid.split("@")[0]}\n *𝙻𝙸𝙽𝙺𝚂 𝙲𝙾𝚄𝙽𝚃 :* ${devicesLength}\n\n> ${texts.warningBotLinked}\n${texts.version}`,
    contextInfo: { ...contextInfo, mentionedJid: [jid] },
  });
}

module.exports = {
  name: plugins.isLinked.plug,
  description: plugins.isLinked.desc,
  async execute(sock, msg, args, MyJid) {
    try {
      if (msg.key.remoteJid.endsWith("@g.us")) {
        const msgInfo = msg.message.extendedTextMessage?.contextInfo;
        const isReply = msgInfo?.quotedMessage;
        const mentions = msgInfo?.mentionedJid || [];

        if (isReply) {
          await checkIfLinked(sock, msg, msgInfo.participant, args, MyJid);
          return;
        }
        if (mentions.length > 0) {
          await checkIfLinked(sock, msg, mentions[0], args, MyJid);
        }
      } else {
        await checkIfLinked(sock, msg, msg.key.remoteJid, args, MyJid);
      }
    } catch (error) {
      console.error(error);
    }
  },
};

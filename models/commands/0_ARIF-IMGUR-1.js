const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

class Imgur {
  constructor() {
    this.clientId = "fc9369e9aea767c";
    this.client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: "Client-ID " + this.clientId
      }
    });
  }

  async uploadFromUrl(fileUrl) {
    const file = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const base64 = Buffer.from(file.data, "binary").toString("base64");

    const res = await this.client.post("upload", {
      image: base64,
      type: "base64"
    });

    return res.data.data.link;
  }
}

module.exports.config = {
  name: "imgur",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Upload image & video to Imgur",
  commandCategory: "Tool",
  usages: "Reply image/video",
  cooldowns: 5
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

module.exports.run = async function ({ api, event }) {
  try {
    if (event.type !== "message_reply")
      return api.sendMessage(
        "⚠️ Please reply to photo or video.",
        event.threadID,
        event.messageID
      );

    const attachments = event.messageReply.attachments;
    if (!attachments || attachments.length === 0)
      return api.sendMessage(
        "⚠️ No attachment found.",
        event.threadID,
        event.messageID
      );

    const imgur = new Imgur();
    let links = [];

    for (const att of attachments) {
      if (att.type !== "photo" && att.type !== "video") continue;

      try {
        const link = await imgur.uploadFromUrl(att.url);
        links.push(link);
      } catch (err) {
        console.log("Upload failed:", err.message);
      }
    }

    if (links.length === 0)
      return api.sendMessage(
        "❌ Upload failed (Imgur limit or invalid file).",
        event.threadID,
        event.messageID
      );

    api.sendMessage(
      `🖼️ IMGUR UPLOAD SUCCESS\n➝ Uploaded: ${links.length}\n➝ Link(s):\n${links.join("\n")}`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ Something went wrong.",
      event.threadID,
      event.messageID
    );
  }
};
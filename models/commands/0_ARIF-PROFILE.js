const fs = require("fs-extra");
const request = require("request");
const path = require("path");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "profile",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Get Facebook profile picture",
  commandCategory: "AI",
  cooldowns: 0
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

module.exports.run = async function({ event, api, args }) {

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  let uid;

  try {
    // ================= UID DETECTION =================

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } 
    else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    }
    else if (args[0] && args[0].includes(".com/")) {
      uid = await api.getUID(args[0]);
    }
    else if (args[0] && !isNaN(args[0])) {
      uid = args[0];
    }
    else {
      uid = event.senderID;
    }

    const imagePath = path.join(cacheDir, `${uid}.png`);

    const profileUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    request(encodeURI(profileUrl))
      .pipe(fs.createWriteStream(imagePath))
      .on("close", () => {
        api.sendMessage(
          {
            body: "✅ Profile picture fetched successfully",
            attachment: fs.createReadStream(imagePath)
          },
          event.threadID,
          () => {
            try { fs.unlinkSync(imagePath); } catch(e) {}
          },
          event.messageID
        );
      });

  } catch (err) {
    console.error("Profile Error:", err);
    return api.sendMessage(
      "❌ Failed to fetch profile picture",
      event.threadID,
      event.messageID
    );
  }
};
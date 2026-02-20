const fs = require("fs-extra");
const request = require("request");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "inf",
  version: "2.4.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Bot info with DP image (Prefix Only)",
  usePrefix: true,
  commandCategory: "INFORMATION",
  cooldowns: 1,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

// 🔥 Main Function
async function sendUptime(api, event) {

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const images = [
    "https://i.imgur.com/i1BgQhz.png",
    "https://i.imgur.com/iTskEvb.png",
    "https://i.imgur.com/AJkpAle.png",
    "https://i.imgur.com/i7Ngm0f.png",
    "https://i.imgur.com/gyxhVCh.png",
    "https://i.imgur.com/nLh8oLe.png"
  ];

  const imgPath = __dirname + "/cache/inf_dp.jpg";

  const commandsCount = global.client.commands
    ? global.client.commands.size
    : "N/A";

  const body =
`╭─────────────────────────────╮
│        🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎        │
╰─────────────────────────────╯

📊 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐬
┌─────────────────────────┐
│ 📝 Commands : ${commandsCount}
│ 🔔 Events   : Active
│ ⚙️ Prefix   : ${global.config.PREFIX}
│ ⏱️ Uptime   : ${hours}h ${minutes}m ${seconds}s
│ 🌐 Host     : Online 🚀
└─────────────────────────┘

👑 𝐎𝐰𝐧𝐞𝐫
➤ ARIF BABU

🚀 𝐐𝐮𝐢𝐜𝐤 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬
➤ ${global.config.PREFIX}help
➤ ${global.config.PREFIX}menu
➤ ${global.config.PREFIX}ping

━━━━━━━━━━━━━━━━━━━━━━━━━━━
❤️ Thanks for using ${global.config.BOTNAME}`;

  request(images[Math.floor(Math.random() * images.length)])
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => {
      api.sendMessage(
        {
          body,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath)
      );
    });
}

// 🔹 Prefix Command Only
module.exports.run = async function ({ api, event }) {
  sendUptime(api, event);
};
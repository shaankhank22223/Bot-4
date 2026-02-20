const fs = require("fs");
const request = require("request");
const path = require("path");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "groupinf",
  version: "2.0.5",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Group info with DP (Everyone can use)",
  commandCategory: "GROUP INFORMATION",
  usages: "groupinf",
  cooldowns: 0,
  dependencies: []
};

// 🔐 Credit Check
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const threadInfo = await api.getThreadInfo(threadID);

  // ================= ADMINS =================
  const adminList = threadInfo.adminIDs || [];
  const adminIDs = adminList.map(a => a.id);
  let adminNames = [];

  for (const id of adminIDs) {
    try {
      const info = await api.getUserInfo(id);
      adminNames.push(info[id].name);
    } catch {
      adminNames.push("Unknown");
    }
  }

  const approval = threadInfo.approvalMode ? "ON" : "OFF";

  // ================= GROUP INFO MESSAGE =================
  let infoMessage =
`╭─────────────────────────────╮
│       👥 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎       │
╰─────────────────────────────╯

📝 Name: ${threadInfo.threadName || "Unknown Group"}
🆔 Thread ID: ${threadID}
👥 Member Count: ${threadInfo.participantIDs.length}
👑 Admin Count: ${adminIDs.length}
🔐 Approval Mode: ${approval}
🖼️ Group Image: ${threadInfo.imageSrc ? "Available" : "Not set"}
`;

  if (threadInfo.emoji) infoMessage += `😀 Group Emoji: ${threadInfo.emoji}\n`;
  if (threadInfo.theme) infoMessage += `🎨 Theme: ${threadInfo.theme}\n`;

  infoMessage += `\n👑 Admins:\n`;
  if (adminNames.length) {
    adminNames.forEach((name, i) => {
      infoMessage += `${i + 1}. ${name}\n`;
    });
  } else {
    infoMessage += "No admins found\n";
  }

  // ================= SEND WITH DP =================
  if (threadInfo.imageSrc) {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgPath = path.join(cacheDir, "group_dp.png");

    request(threadInfo.imageSrc)
      .pipe(fs.createWriteStream(imgPath))
      .on("close", () => {
        api.sendMessage(
          {
            body: infoMessage,
            attachment: fs.createReadStream(imgPath)
          },
          threadID,
          () => fs.unlinkSync(imgPath),
          event.messageID
        );
      })
      .on("error", () => {
        api.sendMessage(infoMessage, threadID, event.messageID);
      });

  } else {
    api.sendMessage(infoMessage, threadID, event.messageID);
  }
};
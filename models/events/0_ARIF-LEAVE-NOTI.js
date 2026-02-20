const fs = require("fs");
const axios = require("axios");
const moment = require("moment-timezone");
const path = require("path");
const https = require("https");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "3.0.2",
  credits: "ARIF BABU",
  description: "Group Leave Suchna Video ke sath"
};

module.exports.run = async function ({ api, event, Users }) {

  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = await Users.getNameUser(event.logMessageData.leftParticipantFbId) || "User";

  const type =
    event.author == event.logMessageData.leftParticipantFbId
      ? "Khud group chhod kar nikal gaya 😐👈"
      : "Admin ne group se bahar nikal diya 😑👈";

  const time = moment.tz("Asia/Kolkata").format("HH:mm:ss");
  const date = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
  const hours = moment.tz("Asia/Kolkata").format("HH");

  let session;
  if (hours >= 5 && hours < 12) session = "Subah";
  else if (hours >= 12 && hours < 17) session = "Dopahar";
  else if (hours >= 17 && hours < 21) session = "Shaam";
  else session = "Raat";

  const threadInfo = await api.getThreadInfo(event.threadID);
  const groupName = threadInfo.threadName || "Group";
  const totalLeft = threadInfo.participantIDs.length;

  const headerStyles = [
"╔═══════ ✦❖✦ ═══════╗",
"╭──────── ★ ·. · ────────╮",
"╒══════════ ★ ∘°❉°∘ ★ ══════════╕",
"✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦",
"╔━━━〔 ✦ ★ ✧ ★ ✦ 〕━━━╗",
"▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰"
  ];

  const footerStyles = [
"╚═══════ ✦❖✦ ═══════╝",
"╰──────── ★ ·. · ────────╯",
"╘══════════ ★ ∘°❉°∘ ★ ══════════╛",
"✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦",
"╚━━━〔 ✦ ★ ✧ ★ ✦ 〕━━━╝",
"▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰"
  ];

  const medias = [
    "https://i.imgur.com/7McT5DO.mp4",
    "https://i.imgur.com/EerjXoi.mp4",
    "https://i.imgur.com/oRAQGdY.mp4",
    "https://i.imgur.com/ZxXZA4w.mp4"
  ];

  const header = headerStyles[Math.floor(Math.random() * headerStyles.length)];
  const footer = footerStyles[Math.floor(Math.random() * footerStyles.length)];
  const media = medias[Math.floor(Math.random() * medias.length)];

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const filePath = path.join(cacheDir, `leave_${Date.now()}.mp4`);

  try {

    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      https.get(media, (response) => {
        if (response.statusCode !== 200) {
          reject("Download fail ho gaya");
          return;
        }
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      }).on("error", reject);
    });

    const msg = 
`${header}
┏━━━━━━━━━━━━━━━┓
┃ 👤 Member : ${name}
┃ 📝 Wajah : ${type}

┃ 🕒 Time : ${session} ${time}
┃ 📅 Date : ${date}

┃ 🏰 Group ka naam : ${groupName}
┃ 👥 Ab total members : ${totalLeft}
┗━━━━━━━━━━━━━━━┛  
${footer}`;

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );

  } catch (err) {
    console.log("Leave Error:", err);
    api.sendMessage("⚠ Media bhejne mein problem aa gayi.", event.threadID);
  }
};
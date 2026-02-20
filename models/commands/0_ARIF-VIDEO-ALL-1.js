const fs = require("fs");
const request = require("request");

// ===== MODULE CONFIG =====
module.exports.config = {
name: "allvideo",
version: "1.4.1",
hasPermssion: 0,
credits: "ARIF BABU",
description: "Send Boy DP or Girl DP images.",
commandCategory: "Random-IMG",
usages: "Type 'boydp' or 'girldp' or 'meme'.",
cooldowns: 2,
};

// ===== HARD CREATOR LOCK (BASE64 PROTECTED) =====
const CREATOR_LOCK = (() => {
const encoded = "QVJJRiBCQUJV"; // base64 of "ARIF BABU"
return Buffer.from(encoded, "base64").toString("utf8");
})();

if (module.exports.config.credits !== CREATOR_LOCK) {
console.log("❌ Creator Lock Activated! Credits change detected.");
module.exports.run = () => {};
module.exports.handleEvent = () => {};
return;
}

// ===== MAIN HANDLE EVENT =====
module.exports.handleEvent = async ({ api, event }) => {
const { body, threadID, messageID } = event;
if (!body) return;

const categories = {
boyvideo: {
links: [
"https://i.imgur.com/ZCmkPTO.mp4", "https://i.imgur.com/JA8jUCD.mp4", "https://i.imgur.com/W3N3f9Y.mp4", "https://i.imgur.com/sAIueiC.mp4"
],
reaction: "🧑‍🎨"
},
girlvideo: {
links: [
"https://i.imgur.com/ZCmkPTO.mp4", "https://i.imgur.com/JA8jUCD.mp4", "https://i.imgur.com/W3N3f9Y.mp4", "https://i.imgur.com/sAIueiC.mp4"
],
reaction: "💃"
},
Tiktok: {
links: [
"https://i.imgur.com/ZCmkPTO.mp4", "https://i.imgur.com/JA8jUCD.mp4", "https://i.imgur.com/W3N3f9Y.mp4", "https://i.imgur.com/sAIueiC.mp4"
],
reaction: "😂"
}
};

const command = body.toLowerCase().trim();
if (!categories[command]) return;

const category = categories[command];
if (!category.links.length) return;

const randomLink = category.links[Math.floor(Math.random() * category.links.length)];
const filePath = __dirname + "/cache/allvideo.mp4";

request(randomLink)
.pipe(fs.createWriteStream(filePath))
.on("close", () => {
api.sendMessage(
{
body: "",
attachment: fs.createReadStream(filePath)
},
threadID,
() => fs.unlinkSync(filePath),
messageID
);
});

api.setMessageReaction(category.reaction, messageID, (err) => {
if (err) console.error("Reaction error:", err);
}, true);

};

// ===== EMPTY RUN =====
module.exports.run = async () => {};
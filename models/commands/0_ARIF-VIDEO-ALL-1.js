const fs = require("fs");
const axios = require("axios");
const path = require("path");

// ===== MODULE CONFIG =====
module.exports.config = {
    name: "videoall",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "GirlVideo & TikTok random video sender",
    commandCategory: "Random-VIDEO",
    usages: "girlvideo / tiktok",
    cooldowns: 3,
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

// ===== HANDLE EVENT =====
module.exports.handleEvent = async ({ api, event }) => {
    const { body, threadID, messageID } = event;
    if (!body) return;

    const categories = {
        girlvideo: {
            links: [
                "https://i.imgur.com/ZCmkPTO.mp4",

"https://i.imgur.com/JA8jUCD.mp4",

"https://i.imgur.com/W3N3f9Y.mp4",
                "https://i.imgur.com/sAIueiC.mp4"
            ],
            reaction: "✅"
        },
        tiktok: {
            links: [
                "https://i.imgur.com/ZCmkPTO.mp4",

"https://i.imgur.com/JA8jUCD.mp4",

"https://i.imgur.com/W3N3f9Y.mp4",
                "https://i.imgur.com/sAIueiC.mp4"
            ],
            reaction: "🥳"
        }
    };

    const command = body.toLowerCase().trim();
    if (!categories[command]) return;

    const category = categories[command];

    if (!category.links.length) {
        return api.sendMessage("❌ No video links added yet.", threadID, messageID);
    }

    const randomLink = category.links[Math.floor(Math.random() * category.links.length)];

    // ===== CACHE FOLDER AUTO CREATE =====
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `${command}_${Date.now()}.mp4`);

    try {
        const response = await axios({
            method: "GET",
            url: randomLink,
            responseType: "stream",
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            api.sendMessage(
                {
                    body: ``,
                    attachment: fs.createReadStream(filePath)
                },
                threadID,
                () => fs.unlinkSync(filePath),
                messageID
            );
        });

        writer.on("error", () => {
            api.sendMessage("❌ Video download failed.", threadID, messageID);
        });

        api.setMessageReaction(category.reaction, messageID, () => {}, true);

    } catch (err) {
        console.error(err);
        api.sendMessage("❌ Error fetching video.", threadID, messageID);
    }
};

module.exports.run = async () => {};
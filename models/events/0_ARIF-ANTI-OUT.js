module.exports.config = {
  name: "Antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "ARIF BABU",
  description: "MADE BY ARIF BABU"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout == false) return;

  // Agar bot khud nikla ho to ignore
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const userID = event.logMessageData.leftParticipantFbId;
  const name =
    global.data.userName.get(userID) ||
    await Users.getNameUser(userID);

  // Check khud nikla ya kisi ne nikala
  const type =
    (event.author == userID)
      ? "self-separation"
      : "kick";

  // Agar banda khud nikla
  if (type == "self-separation") {
    api.addUserToGroup(userID, event.threadID, (error, info) => {
      if (error) {
        api.sendMessage(
          `😏 Arre ${name} boss, bhagna itna aasan nahi hai 😄`,
          event.threadID
        );
      } else {
        api.sendMessage(
          `🥱 ${name} boss wapas aa gaye, antiout ON hai 😎`,
          event.threadID
        );
      }
    });
  }
};
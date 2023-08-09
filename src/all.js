const https = require("https");

const room_id = process.env.HUBOT_GROUPME_ROOM_ID;
const bot_id = process.env.HUBOT_GROUPME_BOT_ID;
const token = process.env.HUBOT_GROUPME_TOKEN;

if (!room_id || !bot_id || !token) {
  console.error(
    `@all ERROR: Unable to read full environment.
    Did you configure environment variables correctly?
    - HUBOT_GROUPME_ROOM_ID
    - HUBOT_GROUPME_BOT_ID
    - HUBOT_GROUPME_TOKEN`
  );
  process.exit(1);
}

class AllBot {
  constructor(robot) {
    this.robot = robot;
    this.blacklist = [];

    this.robot.brain.once("loaded", this.loadBlacklist.bind(this));

    // Listen for new users joining the chat
    this.robot.enter(res => {
      this.sendWelcomeMessage(res.envelope.user);
    });
  }

  // ... (other methods)

  sendWelcomeMessage(user) {
    const welcomeMessage = `Welcome, ${user.name}! We're excited about this trip to Lisbon but please remember to fill the forms in the portal if you haven't done so`;
    this.sendMessageToGroup(welcomeMessage);
  }

  sendMessageToGroup(message) {
    const payload = {
      text: message,
      bot_id,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
    };

    const req = https.request(
      `https://api.groupme.com/v3/groups/${room_id}/messages`,
      requestOptions,
      response => {
        let data = "";
        response.on("data", chunk => (data += chunk));
        response.on("end", () =>
          console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
        );
      }
    );

    req.write(JSON.stringify(payload));
    req.end();
  }

  run() {
    // ... (other listeners)

    // Mention @all command
    this.robot.hear(/(.*)@all(.*)/i, res => this.respondToAtAll(res));
  }
}

module.exports = robot => {
  const bot = new AllBot(robot);
  bot.run();
};

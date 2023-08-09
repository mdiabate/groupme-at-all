const https = require("https");

const room_id = process.env.HUBOT_GROUPME_ROOM_ID;
const bot_id = process.env.HUBOT_GROUPME_BOT_ID;
const token = process.env.HUBOT_GROUPME_TOKEN;

if (!room_id || !bot_id || !token) {
  console.error(
    `@all ERROR: Unable to read full environment...
    // ... (same as before)
  );
  process.exit(1);
}

class WelcomeBot {
  constructor(robot) {
    this.robot = robot;
    this.blacklist = [];
    this.welcomeMessageSent = false;

    this.robot.brain.once("loaded", this.loadBlacklist.bind(this));
    this.robot.brain.once("loaded", this.loadWelcomeMessageStatus.bind(this));

    this.robot.enter(res => this.handleNewUser(res.message.user.id)); // Corrected user ID access
  }

  saveBlacklist() {
    // ... (same as before)
  }

  loadBlacklist() {
    // ... (same as before)
  }

  // ... (same as before, including addToBlacklist, removeFromBlacklist, getUserByName, getUserById, etc.)

  sendWelcomeMessage(user) {
    // ... (same as before)
  }

  handleNewUser(userId) {
    if (!this.welcomeMessageSent && this.blacklist.indexOf(userId) === -1) {
      this.sendWelcomeMessage(this.getUserById(userId));
      this.welcomeMessageSent = true;
    }
  }

  respondToWelcome(res) {
    const user = res.message.user.id; // Corrected user ID access
    this.sendWelcomeMessage(this.getUserById(user));
  }

  run() {
    // ... (same as before, including event listeners for various commands)

    this.robot.hear(/welcome/i, res => this.respondToWelcome(res)); // New listener for welcome command
  }
}

module.exports = robot => {
  const bot = new WelcomeBot(robot);
  bot.run();
};

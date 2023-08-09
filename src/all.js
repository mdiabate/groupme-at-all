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

class WelcomeBot {
  constructor(robot) {
    this.robot = robot;
    this.blacklist = [];
    this.welcomeMessageSent = false;

    this.robot.brain.once("loaded", this.loadBlacklist.bind(this));
    this.robot.brain.once("loaded", this.loadWelcomeMessageStatus.bind(this));

    this.robot.enter(res => this.handleNewUser(res.message.user.id));
  }

  saveBlacklist() {
    console.log("Saving blacklist");
    this.robot.brain.set("blacklist", this.blacklist);
    this.robot.brain.save();
  }

  loadBlacklist() {
    this.blacklist = this.robot.brain.get("blacklist");
    if (this.blacklist) console.log("Blacklist loaded successfully.");
    else console.warn("Failed to load blacklist.");
  }

  addToBlacklist(item) {
    this.blacklist.push(item);
    this.saveBlacklist();
  }

  removeFromBlacklist(item) {
    let index = this.blacklist.indexOf(item);
    if (index !== -1) {
      this.blacklist.splice(index, 1);
      this.saveBlacklist();
      console.log(`Successfully removed ${item} from blacklist.`);
    } else {
      console.warn(`Unable to find ${item} in blacklist!`);
    }
  }

  getUserByName(_name) {
    let name = _name.trim();
    if (name[0] == "@") {
      name = name.slice(1);
    }
    let user = this.robot.brain.userForName(name);
    if (!user.user_id) return null;
    else return user;
  }

  getUserById(id) {
    let user = this.robot.brain.userForId(id);
    if (!user.user_id) return null;
    else return user;
  }

  sendWelcomeMessage(user) {
    const welcomeMessage = `Welcome to the DG Portugal, ${user.name}! If you haven't done so yet, please fill out the flight and meal forms in the portal.`;

    const message = {
      text: welcomeMessage,
      bot_id
    };

    const json = JSON.stringify(message);
    const groupmeAPIOptions = {
      agent: false,
      host: "api.groupme.com",
      path: "/v3/bots/post",
      port: 443,
      method: "POST",
      headers: {
        "Content-Length": json.length,
        "Content-Type": "application/json",
        "X-Access-Token": token
      }
    };
    const req = https.request(groupmeAPIOptions, response => {
      let data = "";
      response.on("data", chunk => (data += chunk));
      response.on("end", () =>
        console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
      );
    });
    req.end(json);
  }

  handleNewUser(userId) {
    if (!this.welcomeMessageSent && this.blacklist.indexOf(userId) === -1) {
      this.sendWelcomeMessage(this.getUserById(userId));
      this.welcomeMessageSent = true;
    }
  }

  respondToWelcome(res) {
    const user = res.message.user.id;
    this.sendWelcomeMessage(this.getUserById(user));
  }

  run() {
    this.robot.hear(/get id (.+)/i, res => this.respondToID(res, res.match[1]));
    this.robot.hear(/get name (.+)/i, res => this.respondToName(res, res.match[1]));
    this.robot.hear(/view( raw)* blacklist/i, res => this.respondToViewBlacklist(res));
    this.robot.hear(/blacklist (.+)/i, res => this.respondToBlacklist(res, res.match[1]));
    this.robot.hear(/whitelist (.+)/i, res => this.respondToWhitelist(res, res.match[1]));

    this.robot.hear(/(.*)@all(.*)/i, res => this.respondToAtAll(res));
    
    this.robot.hear(/welcome/i, res => this.respondToWelcome(res)); // New listener for welcome command
  }
}

module.exports = robot => {
  const bot = new WelcomeBot(robot);
  bot.run();
};

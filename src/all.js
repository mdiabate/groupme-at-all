const https = require("https");

// Bot configs read in from environment
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

class GroupMeBot {
  constructor(robot) {
    this.robot = robot;
    this.messageDefaults = {
      bot_id: process.env.HUBOT_GROUPME_BOT_ID,
    };
    this.commands = [
      { pattern: /(.*)@all(.*)/i, handler: this.respondToAtAll },
      { pattern: /@itinerary/i, handler: this.respondToSchedule },
      { pattern: /@today/i, handler: this.respondToTodaySchedule },
      { pattern: /@form/i, handler: this.respondToTravelForm },
      { pattern: /@hotel/i, handler: this.respondToHotel },
      { pattern: /@lookbook/i, handler: this.respondToLookbook },
    ];
  }

  sendMessage(text, attachments = []) {
    const message = {
      text,
      attachments,
      ...this.messageDefaults,
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
        "X-Access-Token": process.env.HUBOT_GROUPME_TOKEN,
      },
    };

    const req = https.request(groupmeAPIOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () =>
        console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
      );
    });
    req.end(json);
  }

  // Handlers for commands

  respondToAtAll(res) {
    const users = this.robot.brain.users();
    const userNames = Object.values(users).map((user) => user.name);
    const messageText = `Hey ${userNames.join(", ")}, check this out!`;

    this.sendMessage(messageText);
  }

  respondToSchedule(res) {
    const schedule = "Here's the schedule for the trip:\n1. Welcome Mixer and Night Swim \n2. DG Wine Tour \n3. Opulence Dinner \n4. Sunset Boatride ";
    this.sendMessage(schedule);
  }

  respondToTodaySchedule(res) {
    const todayFormatted = new Date().toISOString().split('T')[0];
    const schedules = {
      '2023-08-20': 'Here is the schedule for Day 1:\n1. Event A\n2. Event B\n3. Event C',
      '2023-08-05': 'Here is the schedule for Day 2:\n1. Event X\n2. Event Y\n3. Event Z',
      // Add more dates and schedules as needed
    };
    const schedule = schedules[todayFormatted] || 'There is no schedule available for today.';
    this.sendMessage(schedule);
  }

  respondToTravelForm(res) {
    const travelFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSf9tJWxnH0NPq_oFB_a_bWwZq0zqf1AWDcBZ4tnvnxIsZB3qg/viewform";
    const messageText = `Here's the link to the flight form: ${travelFormURL}`;
    this.sendMessage(messageText);
  }

  respondToHotel(res) {
    const hotelInfo = "Lisbon Marriott Hotel\nAddress: Avenida dos Combatentes 45, Lisbon 1600-042, Portugal";
    const messageText = `Here's the information about Lisbon Marriott Hotel:\n${hotelInfo}`;
    this.sendMessage(messageText);
  }

  respondToLookbook(res) {
    const lookbookUrl = "https://drive.google.com/file/d/1WVCka6T2KG1seeskCAvYvZKrOFwusPmG/view";
    const messageText = `Here's the lookbook URL: ${lookbookUrl}`;
    this.sendMessage(messageText);
  }

  // Run the bot
  run() {
    this.commands.forEach(({ pattern, handler }) => {
      this.robot.hear(pattern, (res) => handler.call(this, res));
    });
  }
}

module.exports = (robot) => {
  const bot = new GroupMeBot(robot);
  bot.run();
};

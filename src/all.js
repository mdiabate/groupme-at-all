const https = require("https");

const room_id = process.env.HUBOT_GROUPME_ROOM_ID;
const bot_id = process.env.HUBOT_GROUPME_BOT_ID;
const token = process.env.HUBOT_GROUPME_TOKEN;

if (!bot_id || !token) {
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
    this.commands = [
      { regex: /get id (.+)/i, handler: this.respondToID },
      { regex: /get name (.+)/i, handler: this.respondToName },
      { regex: /@all/i, handler: this.respondToAtAll },
      { regex: /@itinerary/i, handler: this.respondToSchedule },
      { regex: /@today/i, handler: this.respondToTodaySchedule },
      { regex: /@form/i, handler: this.respondToTravelForm },
      { regex: /@hotel/i, handler: this.respondToHotel },
      { regex: /@lookbook/i, handler: this.respondToLookbook },
      { regex: /@commands/i, handler: this.respondToHelp },
    ];
  }

  getUserByName(_name) {
    let name = _name.trim();
    if (name.startsWith("@")) {
      name = name.slice(1);
    }
    return this.robot.brain.userForName(name);
  }

  sendMessage(message) {
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
        "X-Access-Token": token,
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

  respondToID(res, target) {
    const found = this.getUserByName(target);

    if (found) {
      const id = found.user_id;
      this.sendMessage({ text: `${target}: ${id}`, bot_id });
    } else {
      this.sendMessage({ text: `Could not find a user with the name ${target}`, bot_id });
    }
  }

  respondToName(res, target) {
    const found = this.robot.brain.userForId(target);

    if (found) {
      const name = found.name;
      this.sendMessage({ text: `${target}: ${name}`, bot_id });
    } else {
      this.sendMessage({ text: `Could not find a user with the ID ${target}`, bot_id });
    }
  }

  respondToAtAll(res) {
    const text = res.match[0].length > res.match[1].length ? res.match[0] : res.match[1];
    const message = {
      text,
      bot_id,
      attachments: [{ loci: [], type: "mentions", user_ids: [] }],
    };

    const users = this.robot.brain.users();
    Object.keys(users).map((userID, index) => {
      message.attachments[0].loci.push([index, index + 1]);
      message.attachments[0].user_ids.push(userID);
    });

    this.sendMessage(message);
  }

  respondToSchedule(res) {
    const schedule = "Here's the schedule for the trip:\n1. Welcome Mixer and Night Swim \n2. DG Wine Tour \n3. Opulence Dinner \n4. Sunset Boatride ";

    this.sendGroupMessageWithMentions(schedule);
  }

  respondToTodaySchedule(res) {
    const todayFormatted = new Date().toISOString().split("T")[0];
    const schedules = {
      '2023-08-21': 'Here is the schedule for Day 1:\n1. Event A\n2. Event B\n3. Event C',
      '2023-08-22': 'Here is the schedule for Day 2:\n1. Event X\n2. Event Y\n3. Event Z',
    };
    const schedule = schedules[todayFormatted] || 'There is no schedule available for today.';

    this.sendGroupMessageWithMentions(schedule);
  }

  respondToTravelForm(res) {
    const travelFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSf9tJWxnH0NPq_oFB_a_bWwZq0zqf1AWDcBZ4tnvnxIsZB3qg/viewform";
    this.sendMessage({ text: `Here's the link to the flight form: ${travelFormURL}`, bot_id });
  }

  respondToHotel(res) {
    const hotelInfo = "Lisbon Marriott Hotel\nAddress: Avenida dos Combatentes 45, Lisbon 1600-042, Portugal";
    this.sendMessage({ text: `Here's the information about Lisbon Marriott Hotel:\n${hotelInfo}`, bot_id });
  }

  respondToLookbook(res) {
    const lookbookUrl = "https://drive.google.com/file/d/1WVCka6T2KG1seeskCAvYvZKrOFwusPmG/view";
    this.sendGroupMessageWithMentions(`Here's the lookbook URL: ${lookbookUrl}`);
  }

  respondToHelp(res) {
    const helpMessage = [
      "Available commands:",
      "@all: Mentions all users in the group.",
      "@hotel: Provides information about the hotel.",
      "@schedule: Displays the trip schedule.",
      "@today: Displays the schedule for today.",
      "@form: Provides a link to the flight form.",
      "@lookbook: Shares the lookbook URL.",
    ];
  
    this.sendMessage(helpMessage.join("\n"));
  }

  sendGroupMessageWithMentions(text) {
    const message = {
      text,
      bot_id,
      attachments: [{ loci: [], type: "mentions", user_ids: [] }],
    };

    const users = this.robot.brain.users();
    Object.keys(users).forEach((userID, index) => {
      message.attachments[0].loci.push([index, index + 1]);
      message.attachments[0].user_ids.push(userID);
    });

    this.sendMessage(message);
  }

  run() {
    this.commands.forEach(({ regex, handler }) => {
      this.robot.hear(regex, (res) => handler.call(this, res, res.match[1]));
    });
  }
}

module.exports = robot => {
  const bot = new AllBot(robot);
  bot.run();
};

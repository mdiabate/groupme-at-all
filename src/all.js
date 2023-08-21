const https = require("https");

// Bot configs read in from environment
const bot_id = process.env.HUBOT_GROUPME_BOT_ID;
const token = process.env.HUBOT_GROUPME_TOKEN;

if (!bot_id || !token) {
  console.error(
    `@all ERROR: Unable to read full environment.
    Did you configure environment variables correctly?
    - HUBOT_GROUPME_BOT_ID
    - HUBOT_GROUPME_TOKEN`
  );
  process.exit(1);
}

class AllBot {
  constructor(robot) {
    this.robot = robot;
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

  respondToID(res, target) {
    console.log(`Looking for user ID by name: ${target}`);
    const found = this.getUserByName(target);

    if (found) {
      const id = found.user_id;
      console.log(`Found ID ${id} by name ${target}`);
      res.send(`${target}: ${id}`);
    } else {
      res.send(`Could not find a user with the name ${target}`);
    }
  }

  respondToName(res, target) {
    console.log(`Looking for user name by ID: ${target}`);
    const found = this.robot.brain.userForId(target);

    if (found) {
      const name = found.name;
      console.log(`Found name ${name} by ID ${target}`);
      res.send(`${target}: ${name}`);
    } else {
      res.send(`Could not find a user with the ID ${target}`);
    }
  }

  respondToAtAll(res) {
    const text =
      res.match[0].length > res.match[1].length ? res.match[0] : res.match[1];

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

  respondToSchedule(res) {
    const schedule = "Here's the schedule for the trip:\n1. Welcome Mixer and Night Swim \n2. DG Wine Tour \n3. Opulence Dinner \n4. Sunset Boatride ";

    const message = {
      text: schedule,
      bot_id,
      attachments: [{ loci: [], type: "mentions", user_ids: [] }],
    };

    const users = this.robot.brain.users();
    Object.keys(users).forEach((userID, index) => {
      message.attachments[0].loci.push([index, index + 1]);
      message.attachments[0].user_ids.push(userID);
    });

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

  respondToTodaySchedule(res) {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    const schedules = {
      '2023-08-20': 'Here is the schedule for Day 1:\n1. Event A\n2. Event B\n3. Event C',
      '2023-08-05': 'Here is the schedule for Day 2:\n1. Event X\n2. Event Y\n3. Event Z',
    };

    const schedule = schedules[todayFormatted] || 'There is no schedule available for today.';

    const message = {
      text: schedule,
      bot_id,
      attachments: [{ loci: [], type: 'mentions', user_ids: [] }],
    };

    const users = this.robot.brain.users();
    Object.keys(users).forEach((userID, index) => {
      message.attachments[0].loci.push([index, index + 1]);
      message.attachments[0].user_ids.push(userID);
    });

    const json = JSON.stringify(message);
    const groupmeAPIOptions = {
      agent: false,
      host: 'api.groupme.com',
      path: '/v3/bots/post',
      port: 443,
      method: 'POST',
      headers: {
        'Content-Length': json.length,
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
    };
    const req = https.request(groupmeAPIOptions, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () =>
        console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
      );
    });
    req.end(json);
  }
  
  respondToTravelForm(res) {
    const travelFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSf9tJWxnH0NPq_oFB_a_bWwZq0zqf1AWDcBZ4tnvnxIsZB3qg/viewform";
    
    const message = {
      text: `Here's the link to the flight form: ${travelFormURL}`,
      bot_id,
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

  respondToHotel(res) {
    const hotelInfo = "Lisbon Marriott Hotel\nAddress: Avenida dos Combatentes 45, Lisbon 1600-042, Portugal";
    
    const message = {
      text: `Here's the information about Lisbon Marriott Hotel:\n${hotelInfo}`,
      bot_id,
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

  respondToLookbook(res) {
    const lookbookUrl = "https://drive.google.com/file/d/1WVCka6T2KG1seeskCAvYvZKrOFwusPmG/view";

    const message = {
      text: `Here's the lookbook URL: ${lookbookUrl}`,
      bot_id,
      attachments: [{ loci: [], type: 'mentions', user_ids: [] }],
    };

    const users = this.robot.brain.users();
    Object.keys(users).forEach((userID, index) => {
      message.attachments[0].loci.push([index, index + 1]);
      message.attachments[0].user_ids.push(userID);
    });

    const json = JSON.stringify(message);
    const groupmeAPIOptions = {
      agent: false,
      host: 'api.groupme.com',
      path: '/v3/bots/post',
      port: 443,
      method: 'POST',
      headers: {
        'Content-Length': json.length,
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
    };
    const req = https.request(groupmeAPIOptions, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () =>
        console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
      );
    });
    req.end(json);
  }

  run() {
    this.robot.hear(/get id (.+)/i, res => this.respondToID(res, res.match[1]));
    this.robot.hear(/get name (.+)/i, res =>
      this.respondToName(res, res.match[1])
    );

    this.robot.hear(/@all/i, res => this.respondToAtAll(res));
    this.robot.hear(/@itinerary/i, res => this.respondToSchedule(res));
    this.robot.hear(/@today/i, res => this.respondToTodaySchedule(res));
    this.robot.hear(/@form/i, res => this.respondToTravelForm(res));
    this.robot.hear(/@hotel/i, res => this.respondToHotel(res));
    this.robot.hear(/@lookbook/i, res => this.respondToLookbook(res));
  }
}

module.exports = robot => {
  const bot = new AllBot(robot);
  bot.run();
};

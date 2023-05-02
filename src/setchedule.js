class Bot {
  constructor(robot) {
    this.robot = robot;
    this.room_id = process.env.HUBOT_GROUPME_ROOM_ID;
    this.bot_id = process.env.HUBOT_GROUPME_BOT_ID;
    this.token = process.env.HUBOT_GROUPME_TOKEN;
    this.blacklist = [];
    this.reminders = [];
  }

  sendWelcomeMessage(userId) {
    const userName = this.getUserName(userId);
    const message = `Welcome to the group, ${userName}!`;
    this.sendGroupMeMessage(message);
  }

  getSchedule() {
    const schedule = 'Here is the schedule for today:';
    // TODO: Add logic to get schedule for the day
    this.sendGroupMeMessage(schedule);
  }

  setReminder(time, message) {
    const reminder = {
      time,
      message
    };
    this.reminders.push(reminder);
  }

  sendReminder(time) {
    const message = this.reminders.find(reminder => reminder.time === time);
    if (message) {
      this.sendGroupMeMessage(message);
    }
  }

  // Helper method to send messages to GroupMe
  sendGroupMeMessage(message) {
    const payload = {
      text: message,
      bot_id: this.bot_id
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    fetch(`https://api.groupme.com/v3/groups/${this.room_id}/messages?token=${this.token}`, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  // Helper method to get user name from ID
  getUserName(userId) {
    const users = this.robot.brain.users();
    const user = users[userId];
    if (user) {
      return user.name;
    } else {
      return '';
    }
  }

  run() {
    this.robot.hear(/hello/i, res => {
      const userName = this.getUserName(res.message.user.id);
      const message = `Hello, ${userName}!`;
      this.sendGroupMeMessage(message);
    });

    this.robot.hear(/welcome @(.*)/i, res => {
      const userId = res.match[1];
      this.sendWelcomeMessage(userId);
    });

    this.robot.hear(/schedule/i, res => {
      this.getSchedule();
    });

    this.robot.hear(/set reminder (\d+):(\d+) (.*)/i, res => {
      const hour = parseInt(res.match[1]);
      const minute = parseInt(res.match[2]);
      const time = new Date();
      time.setHours(hour, minute, 0);
      const message = res.match[3];
      this.setReminder(time, message);
      this.sendGroupMeMessage(`Reminder set for ${hour}:${minute}.`);
    });

    setInterval(() => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}`;
      this.sendReminder(time);
    }, 1000 * 60);
  }
}

module.exports = robot => {
  const bot = new Bot(robot);
  bot.run();
};

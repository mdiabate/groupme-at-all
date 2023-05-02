const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Bot configs read in from environment
const room_id = process.env.HUBOT_GROUPME_ROOM_ID;
const bot_id = process.env.HUBOT_GROUPME_BOT_ID;
const token = process.env.HUBOT_GROUPME_TOKEN;

// Mention everyone in the group
app.post('/all', (req, res) => {
  const message = req.body.text;
  const payload = {
    bot_id: BOT_ID,
    text: `@all ${message}`,
  };
  sendGroupMeMessage(payload);
  res.status(200).end();
});

// Give the schedule of the day
app.post('/schedule', (req, res) => {
  const schedule = getSchedule();
  const payload = {
    bot_id: BOT_ID,
    text: schedule,
  };
  sendGroupMeMessage(payload);
  res.status(200).end();
});

// Welcome new member with a message
app.post('/botJoined', (req, res) => {
  const newMember = req.body.name;
  const payload = {
    bot_id: BOT_ID,
    text: `Welcome to the group, ${newMember}!`,
  };
  sendGroupMeMessage(payload);
  res.status(200).end();
});

// Schedule task to alert everyone at a specific time
const alertJob = schedule.scheduleJob('0 9 * * *', () => {
  const payload = {
    bot_id: BOT_ID,
    text: 'Good morning, everyone! Time to wake up!',
  };
  sendGroupMeMessage(payload);
});

// Send a message to the GroupMe API
function sendGroupMeMessage(payload) {
  const data = JSON.stringify(payload);
  const options = {
    hostname: 'api.groupme.com',
    port: 80,
    path: '/v3/bots/post',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'X-Access-Token': ACCESS_TOKEN,
    },
  };
  const req = http.request(options, (res) => {});
  req.on('error', (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
}

// Get the schedule for the day
function getSchedule() {
  const today = moment().format('MMMM Do YYYY');
  const schedule = `
    Good morning, everyone! Here's the schedule for ${today}:
    9:00am - Morning meeting
    10:00am - Project update
    11:00am - Break
    12:00pm - Lunch
    1:00pm - Client meeting
    2:00pm - Coding session
    3:00pm - Wrap up
  `;
  return schedule;
}

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

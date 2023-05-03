class AllBot {
  constructor(groupmeAccessToken, groupId) {
    this.groupmeAccessToken = groupmeAccessToken;
    this.groupId = groupId;
  }

  // Sends a welcome message to a new member of the chat
  sendWelcomeMessage(newMemberName) {
    const message = `Welcome to the group, ${newMemberName}!`;
    this.postMessage(message);
  }

  // Posts a custom daily schedule of activities
  postDailySchedule(schedule) {
    const message = `Here's the schedule for today:\n${schedule}`;
    this.postMessage(message);
  }

  // Sends reminders at specific times
  sendReminder(message, time) {
    // Use a library like moment.js to parse the time and set a timer for the reminder
    const reminderTime = moment(time, 'h:mm A').valueOf();
    setTimeout(() => {
      this.postMessage(message);
    }, reminderTime - Date.now());
  }

  // Helper method to post a message to the GroupMe API
  postMessage(message) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    };

    fetch(`https://api.groupme.com/v3/groups/${this.groupId}/messages?token=${this.groupmeAccessToken}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to post message: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}

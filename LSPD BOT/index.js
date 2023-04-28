const Discord = require('discord.js');
const client = new Discord.Client();

// Map to store user data
const userData = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
  if (message.author.bot) return;
  
  // Command to clock in
  if (message.content.toLowerCase() === '!clockin') {
    const userId = message.author.id;
    const user = message.author.username;
    const currentTime = new Date().toLocaleTimeString();
    
    if (userData.has(userId)) {
      message.reply('You are already clocked in.');
    } else {
      userData.set(userId, { user, clockIn: currentTime });
      message.reply(`You have been clocked in at ${currentTime}.`);
    }
  }
  
  // Command to clock out
  if (message.content.toLowerCase() === '!clockout') {
    const userId = message.author.id;
    const currentTime = new Date().toLocaleTimeString();
    
    if (!userData.has(userId)) {
      message.reply('You are not currently clocked in.');
    } else {
      const userDataEntry = userData.get(userId);
      const clockInTime = userDataEntry.clockIn;
      const totalTime = calculateTimeDifference(clockInTime, currentTime);
      
      message.reply(`You have been clocked out at ${currentTime}. Total time: ${totalTime}.`);
      userData.delete(userId);
    }
  }
  
  // Command to force clock out a user (admin only)
  if (message.content.toLowerCase() === '!forceclockout' && message.member.hasPermission('ADMINISTRATOR')) {
    const userId = message.mentions.users.first().id;
    
    if (!userData.has(userId)) {
      message.reply('User is not currently clocked in.');
    } else {
      const userDataEntry = userData.get(userId);
      const clockInTime = userDataEntry.clockIn;
      const currentTime = new Date().toLocaleTimeString();
      const totalTime = calculateTimeDifference(clockInTime, currentTime);
      
      message.reply(`${userDataEntry.user} has been forcefully clocked out at ${currentTime}. Total time: ${totalTime}.`);
      userData.delete(userId);
    }
  }
  
  // Command to purge all data (admin only)
  if (message.content.toLowerCase() === '!purgealldata' && message.member.hasPermission('ADMINISTRATOR')) {
    userData.clear();
    message.reply('All user data has been purged.');
  }
  
  // Command to show who is currently clocked in
  if (message.content.toLowerCase() === '!showclockedin') {
    if (userData.size === 0) {
      message.reply('No users are currently clocked in.');
    } else {
      const clockedInUsers = Array.from(userData.values()).map((entry) => entry.user).join(', ');
      message.reply(`Users currently clocked in: ${clockedInUsers}`);
    }
  }
  
  // Command to show all data (admin only)
  if (message.content.toLowerCase() === '!showalldata' && message.member.hasPermission('ADMINISTRATOR')) {
    if (userData.size === 0) {
      message.reply('No user data available.');
    } else {
      let userDataString = 'User Data:\n\n';
      userData.forEach((entry, userId) => {
        const { user, clockIn } = entry;
        userDataString += `User: ${user}\nClocked In: ${clockIn}\n\n`;
      });
      
      message.reply(userDataString);

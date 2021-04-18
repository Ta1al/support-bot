const { Command } = require('discord-akairo');

class WebhookCommand extends Command {
  constructor() {
    super('webhook', {
      category: 'Utility',
      description: {
        content: 'Send a message using a webhook',
        usage: '<channel> <text>',
        examples: [
          '#announcements something really cool you should know about guys'
        ]
      },
      aliases: ['webhook'],
      userPermissions: ['MANAGE_MESSAGES'],
      cooldown: 3e3,
      args: [
        {
          id: 'channel',
          type: 'textChannel',
          prompt: {
            start: 'Enter a text channel',
            retry: 'Enter a valid text channel'
          }
        },
        {
          id: 'text',
          match: 'rest',
          prompt: {
            start: 'Enter your message'
          }
        }
      ]
    });
  }

  async exec(msg, { channel, text }) {
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === 'Support QR'); // to prevent multiple webhooks for the bot, we'll just use the one for qrs
    if(!webhook) webhook = await channel.createWebhook('Support QR');
    await webhook.send(text, { username: msg.author.username, avatarURL: msg.author.displayAvatarURL() })
       .catch(e => {
          if(e) return msg.reply(`⚠ Error occured:\n \`\`\`js\n${e}\`\`\``)
      });
    return msg.reply('✅');
  }
}

module.exports = WebhookCommand;

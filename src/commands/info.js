const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const os = require('os');
const packagee = require('../../../../package.json');
const version = packagee.version;
const djs = packagee.dependencies['discord.js'];
module.exports = class info extends Command {
  constructor() {
    super('info', {
      category: 'Utility',
      aliases: ['info', 'botinfo', 'botstats'],
      description: {
        content: 'Provides info about the bot.'
      }
    });
  }


  exec(msg) {
    // Uptime
    const ut = this.client.functions.msToTime(this.client.uptime);
    // RAM Usage
    let memoryUsage = '0MB';
    const memory = process.memoryUsage().heapUsed / (1024 * 1024);
    if (memory >= 1024) memoryUsage = (memory / 1024).toFixed(2) + 'GB';
    else memoryUsage = memory.toFixed(2) + 'MB';

    const embed = new MessageEmbed()
      .setColor('#11b5eb')
      .setTitle(this.client.user.tag)
      .setFooter(`Reqested by ${msg.author.tag}`)
      .setTimestamp()
      .setDescription(`${this.client.user.tag} is a bot made for Promise Solutions as a helper bot.`)
      .addFields([
        {
          name: 'Env',
          value: [
            '**Language:** [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "Link to Javascript Docs")',
            `**Library:** [Discord.js${djs}](https://discord.js.org/#/ "Link to Discord.js Docs")`,
            '**Framework:** [Akairo](https://discord-akairo.github.io/#/ "Link to Discord-Akairo Docs")',
            `**Operating System:** \`${os.platform()}\``
          ],
          inline: true
        },
        {
          name: 'Stats',
          value: [
            `**Memory Usage:** ${memoryUsage}`,
            `**Uptime:** **\`${ut}\`**`,
            `**Build:** \`${version}\``
          ],
          inline: true
        },
        {
          name: 'Author',
          value: [
            '<@462870395314241537>'
          ],
          inline: true
        }
      ]);
    msg.channel.send(embed);
  }
};
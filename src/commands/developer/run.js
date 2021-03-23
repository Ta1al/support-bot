const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class runCommand extends Command {
  constructor() {
    super('run', {
      category: 'dev',
      aliases: ['run', 'exec'],
      description: {
        content: 'Executes a command via `child_process`',
        usage: '<command>',
        examples: [
          'git pull'
        ]
      },
      args: [
        {
          id: 'command',
          match: 'rest',
          prompt: {
            start: 'Enter a command'
          }
        }
      ],
      ownerOnly: true
    });
  }


  async exec(msg, { command }) {
    const { spawn } = require('child_process');
    const arr = [`$ ${command}`];
    const e = await msg.reply('🔁 Working...');
    const splitted = command.match(/(?:[^\s"]+|"[^"]*")+/g);
    const run = spawn(splitted[0], splitted.slice(1).length ? splitted.slice(1) : undefined);

    run.stdout.on('data', async data => {
      arr.push(data);
      e.edit(pattern(arr.join('\n'))).catch();
    });

    run.stderr.on('data', async data => {
      arr.push(data);
      e.edit(pattern(arr.join('\n'))).catch();
    });

    run.on('error', async (error) => {
      arr.push(error);
      e.edit(pattern(arr.join('\n'))).catch();
    });

    run.on('close', async code => {
      arr.push(`Process exited with code: ${code}`);
      const res = arr.join('\n');
      if (res.length > 1980) {
        const res1 = res.slice(0, 1960);
        let res2 = res.slice(1960);
        if (res2.length > 2000) res2 = `${res2.slice(0, 2000)} [Too long to show...]`;
        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setDescription(pattern(res2));
        return await e.edit(pattern(res1), embed);
      }
      return await e.edit(pattern(res));
    });
  }
};

function pattern(str) {
  return `\`\`\`css\n${str}\`\`\``;
}
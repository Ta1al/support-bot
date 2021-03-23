const { Command } = require('discord-akairo');

const nl = process.env.TOKEN;
const nlPattern = new RegExp(nl, 'g');
const util = require('util');
const discord = require('discord.js');
const tags = require('common-tags');
module.exports = class evalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      category: 'dev',
      description: {
        content: 'Evaluate any javascript code.',
        usage: '<code>',
        examples: [
          'msg.channel.send(\'Hello\')',
          '1 + 1'
        ]
      },
      args: [
        {
          id: 'code',
          match: 'restContent',
          prompt: {
            start: 'What code would you like to evaluate?',
            retry: 'Invalid code! Please try again...'
          }
        }
      ],
      ownerOnly: true
    });
  }
  async exec(msg, { code: toEval }) {
    const code = toEval;
    const evaled = await eval(code);

    // Run the code and measure its execution time
    let hrDiff;
    try {
      const hrStart = process.hrtime();
      hrDiff = process.hrtime(hrStart);
    }
    catch (err) {
      return msg.reply(`Error while evaluating: \`${err}\``);
    }

    // Prepare for callback time and respond
    const result = makeResultMessages(evaled, hrDiff, code);
    if (Array.isArray(result)) {
      return result.map(item => msg.reply(item));
    }
    else {
      return msg.reply(result);
    }

    function makeResultMessages(results, hrDiffs, input = null) {
      const inspected = util.inspect(results, { depth: 0 })
        .replace(nlPattern, '\n');
      const split = inspected.split('\n');
      const last = inspected.length - 1;
      const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
      const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ?
        split[split.length - 1] :
        inspected[last];
      const prepend = `\`\`\`javascript\n${prependPart}\n`;
      const append = `\n${appendPart}\n\`\`\``;
      if (input) {
        return discord.splitMessage(tags.stripIndents`
				*Executed in ${hrDiffs[0] > 0 ? `${hrDiffs[0]}s ` : ''}${hrDiffs[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
      }
      else {
        return discord.splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiffs[0] > 0 ? `${hrDiffs[0]}s ` : ''}${hrDiffs[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
      }
    }
  }
};
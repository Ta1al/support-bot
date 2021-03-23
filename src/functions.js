const 
  hastebin = require('hastebin-gen'),
  config = require('../config.json');


module.exports = {
  ticket: {
    async open(client, id, ticket) {
      let tickets = await client.tickets.get(id, 'openTickets', []);
      tickets = tickets.concat(ticket);
      await client.tickets.set(id, 'openTickets', tickets);
    },
    async close(client, id, ticket, closeData) {
      let openTickets = await client.tickets.get(id, 'openTickets', []);
      let closedTickets = await client.tickets.get(id, 'closedTickets', []);
  
      const t = openTickets.find(t => t.channel === ticket.channel);
      if (!openTickets.length || !t) return false;
  
      openTickets = client.util.removeItemOnce(openTickets, t);
      await client.tickets.set(id, 'openTickets', openTickets);
  
      t.closed = true;
      t.closedReason = closeData.closeReason;
      t.closedBy = closeData.closedBy;
      closedTickets = closedTickets.concat(ticket);
      await client.tickets.set(id, 'closedTickets', closedTickets);
      return true;
    },
  
    async edit(client, id, oldTicket, newTicket) {
      let tickets = await client.tickets.get(id, 'openTickets', []);
      if(!tickets.length) return false;
      tickets = client.util.removeItemOnce(tickets, oldTicket);
      tickets = tickets.concat(newTicket);
      await client.tickets.set(id, 'openTickets', tickets);
      return true;
    }
  },
  async addReactions(msg, ...emojis) {
    for (const emoji of emojis) {
      await msg.react(emoji);
    }
    return msg;
  },

  removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  },
  async haste(str) {
    let haste, i = 0;
    while (!haste && i < config.bins.length) {
      await hastebin(str, { url: config.bins[i] })
        .then(link => {
          haste = link;
        })
        .catch(e => {
          if (e) i++;
        });
    }
    // https://haste.red-panda.red/ puts a double // at the end for some reasons
    return haste ? haste.replace(/red\/\//, 'red/') : 'Try Again Later';
  },

  msToTime(ms) {
    const years = Math.floor(ms / 31536000000); // 365*24*60*60*1000
    const yearsms = ms % 31536000000; // 365*24*60*60*1000
    const months = Math.floor(yearsms / 2592000000); // 30*24*60*60*1000
    const days = Math.floor((yearsms / 86400000) % 30); // 24*60*60*1000
    const daysms = ms % 86400000; // 24*60*60*1000
    const hours = Math.floor(daysms / 3600000); // 60*60*1000
    const hoursms = ms % 3600000; // 60*60*1000
    const minutes = Math.floor(hoursms / 60000); // 60*1000
    const minutesms = ms % 60000; // 60*1000
    const sec = Math.floor(minutesms / 1000);
  
    let str = '';
    if (years) str = `${str + years} year${years > 1 ? 's' : ''} `;
    if (months) str = `${str + months} month${months > 1 ? 's' : ''} `;
    if (days) str = `${str + days} day${days > 1 ? 's' : ''} `;
    if (hours) str = `${str + hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes) str = `${str + minutes} minute${minutes > 1 ? 's' : ''} `;
    if (sec) str = `${str + sec} second${sec > 1 ? 's' : ''} `;
  
    return str;
  }
};
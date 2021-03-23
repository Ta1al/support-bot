const 
  hastebin = require('hastebin-gen'),
  config = require('../config.json');


module.exports = {
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
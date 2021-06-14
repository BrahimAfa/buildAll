const fs = require('fs');

module.exports.logme = (msg) => {
    /* console.log(`LOGGING :: ${msg}\n`); */
    const date = new Date();
    const s = `0${date.getSeconds()}`.substr(-2);
    const i = `0${date.getMinutes()}`.substr(-2);
    const H = `0${date.getHours()}`.substr(-2);
    const dd = `0${date.getDate()}`.substr(-2);
    const mm = `0${date.getMonth() + 1}`.substr(-2);
    const YY = date.getFullYear();
    const fileName = `${mm}-${YY}.log`;
    const fullMessage = `${H}:${i}:${s} ${dd}-${mm}-${YY} :: ${msg}\n`;
    const filePath = `./logs/${fileName}`;
    console.log(`[LOGME] : ${fullMessage}`);
    fs.appendFileSync(`${filePath}`, fullMessage);
};

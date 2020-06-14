const config = require('./config.json');
const fs = require('fs')

function writeLog(level, data) {
    if(config.logging) {
        if(config.logging_level && level <= config.logging_level) {
            fs.appendFile('./logs.txt', data + '\n', err => {
                if(err) throw err;
            });
        }
    }
}

module.exports = writeLog;
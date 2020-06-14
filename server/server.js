const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const config = require('./config.json');

const writeLog = require('./logger.js');

const Channels = require('./channels.class');
const Client = require('./client.class');
const Channel = require('./channel.class');

const channels = [];
const channelObjs = {};

const clients = {
    consumers: [],
    producers: [],
    processors: []
}
const clientObjs = {};

io.on('connection', socket => {
    socket.on('register', data => {
        if(data && data.type && data.type === 'producer') {
            clients.producers.push(socket.id);
            clientObjs[socket.id] = new Client(socket.id, socket, 'producer');
            writeLog(0, `REG > registered producer with id=${socket.id}`)
        } else if(data && data.type && data.type === 'consumer') {
            clients.consumers.push(socket.id);
            clientObjs[socket.id] = new Client(socket.id, socket, 'consumer');
            writeLog(0, `REG > registered consumer with id=${socket.id}`)
        } else if(data && data.type && data.type === 'processor') {
            clients.processors.push(socket.id);
            clientObjs[socket.id] = new Client(socket.id, socket, 'processor');
            writeLog(0, `REG > registered processor with id=${socket.id}`)
        } else {
            socket.emit('exception', { mgs: 'Syntax: data.type = producer|consumer|processor' })
        }
    });
    socket.on('subscribe', data => {
        if(clients.consumers.indexOf(socket.id) != -1) {
            if(data.channel) {
                writeLog(1, `SUB > client with id=${socket.id} registered for ${data.channel}`)
                if(channels.indexOf(data.channel) === -1) {
                    channels.push(data.channel);
                    channelObjs[data.channel] = new Channel(data.channel, config.batchSize || 1);
                    writeLog(1, `SET > created new channel with id=${data.channel}`)
                }
                channelObjs[data.channel].addConsumer(clientObjs[socket.id]);
            } else {
                socket.emit('exception',  { mgs: 'Channel must be specified in payload.channel' });
            }
        } else {
            socket.emit('exception',  { mgs: 'Wrong role for action subscribe or client has not registered' })
        }
    });
    socket.on('unsubscribe', data => {
        if(clients.consumers.indexOf(socket.id) != -1) {
            if(data.channel) {
                writeLog(1, `SUB > client with id=${socket.id} unsubscribed channel with id=${data.channel}`)
                if(channels.indexOf(data.channel) != -1) {
                    channelObjs[data.channel].removeConsumer(socket.id);   
                } 
            } else {
                socket.emit('exception',  { mgs: 'Channel must be specified in payload.channel' });
            }
        } else {
            socket.emit('exception',  { mgs: 'Wrong role for action subscribe or client has not registered' })
        }
    });
    socket.on('data', data => {
        if(clients.producers.indexOf(socket.id) != -1) {
            if(data && data.channel && data.payload) {
                if(channels.indexOf(data.channel) === -1) {
                    channels.push(data.channel);
                    channelObjs[data.channel] = new Channel(data.channel, config.batchSize || 1);
                    writeLog(1, `SET > created new channel with id=${data.channel}`)
                }
                channelObjs[data.channel].addDataInstance(data);
                writeLog(2, `ADD > client with id=${socket.id} added data instance to stack of channel with id=${data.channel}`)
            } else {
                socket.emit('exception',  { mgs: 'Data not specified' })
            }
        } else {
            socket.emit('exception',  { mgs: 'Wrong role for action subscribe or client has not registered' })
        }
    });
    socket.on('disconnect', () => {
        /** remove user */
        if(clientObjs[socket.id]) {
            let role = clientObjs[socket.id].role + 's';
            delete clientObjs[socket.id];
            clients[role].splice(clients[role].indexOf(socket.id), 1);
            if(role === 'consumer') {
                /** remove user from channels */
                for(let i of channels) {
                    channelObjs[i].removeConsumer(socket.id);
                }
            }
        }
        writeLog(1, `DIS > client with id=${socket.id} disconnected`)
    })
})

const port = process.env.PORT || config.port || 3000;
http.listen(port, () => {
    console.log(`🚀 listening on port ${port}`);
});
writeLog(0, `### Tarantula-Streams ###\nstarted server at ${Date.now()}ms\nLogging level: ${config.logging_level}\n\n`);
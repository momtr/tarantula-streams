const Channel = require('./channel.class');

class Channels {

    constructor() {
        this.channels = {};
    }

    addChannel(id, batchSize = 1) {
        this.channels[id] = new Channel(id, batchSize);
    }

    addDataInstance(id, dataInstance) {
        this.channels[id].addDataInstance(dataInstance);
    }

    addConsumer(id, consumerObj) {
        this.channels[id].addConsumer(consumerObj);
    }

}

module.exports = Channels;
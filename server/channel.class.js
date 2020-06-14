class Channel {

    constructor(id, batchSize = 1) {
        this.id = id;
        this.data = [];
        this.batchSize = batchSize;
        this.consumers = [];
    }

    addDataInstance(data) {
        this.data.push(data);
        if(this.data.length == this.batchSize) {
            console.log(this.consumers);
            for(let i of this.consumers) {
                i.sendDataStack(data);
            }
            this.data = [];
        }
    }

    addConsumer(consumer) {
        this.consumers.push(consumer);
    }

    removeConsumer(id) {
        for(let i = 0; i < this.consumers.length; i++) {
            if(this.consumers[i].id === id) 
                this.consumers.splice(i, 1);
        }
    }

}

module.exports = Channel;
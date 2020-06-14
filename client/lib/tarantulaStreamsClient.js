class TarantulaStreamsClient {

    constructor(url, callback, role) {
        if(!url || !role)
            throw new Error('Url or role not spcified')
        this.role = role;
        this.socket = io(url);
        this.socket.emit('register', { type: this.role });
        if(callback) {
            this.socket.on('connected', () => callback(this.socket));
        }
        this.onError(err => { if(err) throw err });
    }

    onError(callback) {
        this.socket.on('exception', data => callback(data));
    }

    disconnect() {
        this.socket.emit('disconnect');
    }

}

class TarantulaStreamsProducer extends TarantulaStreamsClient {

    constructor(url, callback) {
        super(url, callback, 'producer');
    }

    sendData(channel, payload) {
        if(channel && payload) {
            this.socket.emit('data', { channel, payload });
        } else
            throw new Error('channel and data must be specified');
    }

}

class TarantulaStreamsConsumer extends TarantulaStreamsClient {

    constructor(url, callback) {
        super(url, callback, 'consumer');
    }

    subscribe(channel, callback) {
        if(channel && callback) {
            this.socket.emit('subscribe', { channel });
            this.socket.on('data_get', data => callback(data));
        } else
            throw new Error('data and callback must be specified');
    }

}
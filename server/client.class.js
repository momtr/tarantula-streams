class Client {

    constructor(id, socket, role) {
        this.id = id;
        this.socket = socket;
        this.role = role;
    }

    /**
     * Sends data back to the client
     * @param {*} data 
     */
    sendDataStack(data) {
        this.socket.emit('data_get', data);
    }

}

module.exports = Client;
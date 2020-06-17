# tarantula-streams
🚀 (very little) real-time data streaming server (with Socket.io)

<img src="https://github.com/moritzmitterdorfer/tarantula-streams/blob/master/imgs/tarantula-streams.png">

## 🍭 How it works
Tarantula-Streams enables you to manage all connections between different services in real-time via a central repository.

<br>
There are two basic types of clients:

- `Producers`: send data over a particular channel to the tarantula-streams server
- `Consumers`: consume data and subscribe to a channel 

A channel is just a cluster of data, e.g. 'website_mouse_movements'. 

## 🦕 Install

### 1. Server
1.1 clone this repo
```
$ git clone https://github.com/moritzmitterdorfer/tarantula-streams.git
```

1.2 cd into server and install NPM packages
```
$ cd client && npm install
```

1.3 Configure `port` and `logging level` as well as the `batchSize`: Go into `server/config.json` and configure the port of the server as well as the logging level (0 = basic, 2 = everything). 
```json
{
    "port": 3001, // port
    "logging": true, // if logs should be generated
    "logging_level": 2, // logging level
    "batchSize": 2 // when event is emitted (after how many instances of data)
}
```

1.4 start the server
```
$ npm start
```

### 2. Client (JS version)

> Note: There is a JS client!

2.1 Go to your service application (usually backend) where you want to use the client.

2.2 Decide for `Producer` or `Consumer` or `both`: Does the service produce or consume data?

2.3 Go into the `client` directory and take the `lib` files and store them somewhere.

2.4 Find out the server address and port (port is configured in `server/config.json`). 
```javascript
    // address and port 
    const address = 'YOUR_ADDRESS'; // locally: localhost
    const port = 3001; // port 
    // producer
    let producer = new TarantulaStreamsProducer(`ws://${ADDRESS}:${PORT}`);
    // or consumer
    let consumer = new TarantulaStreamsConsumer(`ws://${ADDRESS}:${PORT}`);
```

## 🪐 Send data (producer)
The `TarantulaStreamsProducer` can send data over a particular channel:
```javascript
    // send data
    producer.sendData(channel, json_payload);
    // example
    producer.sendData('website_clicks', { x_click: 100, y_click: 200, meta: { name: 'website_1' } });
```

## 📝 Receive data (consumer)
The `TarantulaStreamsConsumer` can receive data on a particular channel by subscribing to this channel: 
```javascript
    // subscribe to channel
    producer.subscribe(channel, callback);
    // example
    producer.subscribe('website_clicks', data => {
        // do somtehing with data
        console.log(data)
    });
```
const mqtt = require('mqtt');
const axios = require('axios');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://xiot.cloud:1883';
    // this.host = 'xiot.cloud';
    this.username = 'XPosjNkHb'; // mqtt credentials if these are needed to connect
    this.password = 'dunirabenu';
    this.us = {
      clientId: 'WEB_' + Math.random().toString(16).substr(2, 8),
      username: 'XPosjNkHb',
      password: 'dunirabenu',
    };
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, this.us);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('/tele/xChip-C83F59/SENSOR');///cmnd/xChip-C83F59/status10
    // this.mqttClient.subscribe('/stat/xChip-C83F59/STATUS10');///cmnd/xChip-C83F59/status10
    // this.mqttClient.subscribe('stat/xChip-C83F59/STATUS10');///cmnd/xChip-C83F59/status10
    // this.mqttClient.subscribe('/cmnd/xChip-C83F59/status10', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log(message.toString());
      let msg = {};
      try {
        msg = JSON.parse(message);
        
        console.log(msg.StatusSNS.DS18B20.Temperature, msg.StatusSNS.AM2301.Temperature, msg.StatusSNS.AM2301.Humidity);
        axios.post('https://smartreader.jadara.work/api/update',
          {
            "apiKey": "i1IVhlnJDo",
            "sensor1": msg.StatusSNS.DS18B20.Temperature,
            "sensor2": msg.StatusSNS.AM2301.Temperature,
            "sensor3": msg.StatusSNS.AM2301.Humidity,
          })
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch {
        // msg = message.toString();
      }
      
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish('mytopic', message);
  }
}

module.exports = MqttHandler;
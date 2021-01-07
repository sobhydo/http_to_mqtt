var express = require('express');
var bodyParser = require('body-parser');
var mqtt = require('mqtt')
var fs = require('fs')
var path = require('path')
const util = require('util')


var app = express();

var CERT = //certificate
var PORT = //port
var HOST = // host

var options = {
   port: PORT,
   host: HOST,
   clientId: //client_id
   username: //uname
   password: //pswd
   cert: CERT,
   rejectUnauthorized: false,
   protocol: 'mqtts'
}
var client;
var jsonParser = bodyParser.json();
var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.get('/', function (req, res) {
   res.render(__dirname + "/public/index.html");
})

client = mqtt.connect(options);

client.on("connect", () => {
   console.log("MQTT connected");
})

client.on('message', function (topic, message) {
   var msg = JSON.parse(message)
   console.log("topic: " + topic + " msg:" + util.inspect(msg))
});


app.post('/', jsonParser, function (req, res) {
   // Prepare output in JSON format
   data = {
      dev_id: req.body.dev_id,
      pswd: req.body.password,
      tx_cycle: req.body.tx_cycle
   };
   if (data.pswd != "password") {
      console.log("Wrong password")
   }
   else {
      console.log(data);
      var topic = 'publish_topic';
      var tx_cy = data.tx_cycle;
      var msg = '{"port":"222","payload":"' + tx_cy + '","confirmed": false,"window":"BOTH","priority":0}';
      console.log('Try to send downlink message, for ' + data.dev_id + ' set to ' + data.tx_cycle + ' min -> hex ' + tx_cy);
      client.subscribe('reply/+/id/+');

      client.publish(topic, msg);
      res.status(200).send(msg + " sent to broker");
   }
});



var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("App listening at http://%s:%s", host, port)
})

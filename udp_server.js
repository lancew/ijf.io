var dgram = require("dgram");

var server = dgram.createSocket("udp4");

// ------------------
// vars for data
// -----------------
var clock;
var white_score = "";
var blue_score = "";

var old_white_score = "";
var old_blue_score = "";


server.on("message", function (data, rinfo) {
  msg = data.toString();
  clock = msg.slice(35,36) + ":" + msg.slice(36,38);
  white_score = msg.slice(93,97);
  blue_score = msg.slice(155,159);
  if(white_score != old_white_score)
  {
      console.log(clock +" "+white_score+":"+blue_score);
      old_white_score = white_score;
      old_blue_score = blue_score;
  }
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(4001);

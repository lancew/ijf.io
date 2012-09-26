var dgram = require("dgram");
var nano = require('nano')('http://localhost:5984');    
var growl = require('growl')
var Twit = require('twit');

var scoresdb = nano.db.use('scores');

var T = new Twit({
    consumer_key:         '5N9tCGqKThIkUR9c4i6A'
  , consumer_secret:      'QBpo5lvipxz9UGU5dGc0g8zZfBCh6e593dUCRJZObg'
  , access_token:         '330895829-iX6NBI6Bi3rLRP1NahEiwQkvkFBGIKvcJT6kvrV5'
  , access_token_secret:  'a671YljiRNZH5WskSdQNlt4M5xiD0azkT5Ecswyqic'
});

var server = dgram.createSocket("udp4");

// ------------------
// vars for data
// -----------------
var old_blue  = '000(0)';
var old_white = '000(0)';
var flag = 0;

server.on("message", function (data, rinfo) {
  msg = data.toString();
  var data = ParseMsg(msg);

  if(data.ProtoVer == '040'){
	var white_score = data.IpponWhite + data.WazaWhite + data.YukoWhite + "(" + data.PenaltyWhite + ")";
        var blue_score  = data.IpponBlue + data.WazaBlue + data.YukoBlue + "(" + data.PenaltyBlue + ")";
      var msg = "(";
      msg += data.IDEvent.toUpperCase();
      msg = msg.replace(/^\s+|\s+$/g,'');
      msg += " " + data.Category + "kg";
      msg += " Mat:";
      msg += data.MatSending;
      msg += ") ";
      msg += data.TimerMinute + ":" + data.TimerSecond;
      msg += " " + data.NameWhiteLong;
      msg = msg.replace(/^\s+|\s+$/g,'');
      msg += " (";
      msg += data.NationWhite;
      msg += ") ";
      msg += white_score;
      msg += "-";
      msg += blue_score
      msg += " ";
      msg += data.NameBlueLong;
      msg = msg.replace(/^\s+|\s+$/g,'');
      msg += " (";
      msg += data.NationBlue;
      msg += ") ";
      if( (data.Winner != 0 ) )
	{
		if( flag == 0 )
		{
			T.post('statuses/update', { status: msg }, function(err, reply) {
				  console.log(err);
			});
			growl(msg,{title: "Mat "+data.MatSending});
                	console.log(msg);
			flag = 1;
		}
	
	} else { flag = 0; }

       if( (white_score != old_white) || (blue_score != old_blue))
	{
	   // If there is a change in scores, add the data to the couchDB
	   scoresdb.insert(data);

	}

       old_white = white_score;
       old_blue = blue_score;


  } 
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

function ParseMsg(msg) {
  var data = new Object();
  msg = "." + msg;      // Adding one character to make it easier to match the spec in EJU handbook.
  data.ProtoVer       	= msg.substr(2, 3);
  data.IDEvent        	= msg.substr(5, 20);
  data.Gender         	= msg.substr(25, 1);
  data.Category       	= msg.substr(26, 4);
  data.AgeGroup       	= msg.substr(30, 1);
  data.Round          	= msg.substr(21, 1);
  data.ContestID      	= msg.substr(32, 3);
  data.TimerFlag      	= msg.substr(35, 1);
  data.TimerMinute    	= msg.substr(36, 1);
  data.TimerSecond    	= msg.substr(37, 2);
  data.NationWhite    	= msg.substr(39, 3);
  data.IDWhite        	= msg.substr(42, 15);
  data.NameWhiteShort 	= msg.substr(57, 4);
  data.WRLWhite       	= msg.substr(61, 3);
  data.NameWhiteLong  	= msg.substr(64, 30);
  data.IpponWhite     	= msg.substr(94, 1);
  data.WazaWhite      	= msg.substr(95, 1);
  data.YukoWhite      	= msg.substr(96, 1);
  data.PenaltyWhite   	= msg.substr(97, 1);
  data.TimerOasaeWhite 	= msg.substr(98, 1);
  data.TeamScoreWhite  	= msg.substr(100, 1);
  data.NationBlue	= msg.substr(101, 3);
  data.IDBlue		= msg.substr(104, 15);
  data.NameBlueShort	= msg.substr(119, 4);
  data.WRLBlue		= msg.substr(123, 3);
  data.NameBlueLong	= msg.substr(126, 30);
  data.IpponBlue	= msg.substr(156, 1);
  data.WazaBlue		= msg.substr(157, 1);
  data.YukoBlue		= msg.substr(158, 1);
  data.PenaltyBlue	= msg.substr(159, 1);
  data.TimerOsaeBlue	= msg.substr(160, 2);
  data.TeamScoreBlue	= msg.substr(162, 1);
  data.GoldenScore	= msg.substr(163, 1);
  data.Winner		= msg.substr(164, 1);
  data.IDReferee	= msg.substr(165, 15);
  data.IDJudge1		= msg.substr(180, 15);
  data.IDJudge2		= msg.substr(195, 15);
  data.MatSending	= msg.substr(210, 1);
  data.DisplayMode	= msg.substr(211, 1);		// 1 Logo, 6 Timer
 
  return(data);
}


server.bind(4001);

// --------------------------------------------
// IJF Scoreboard listener utility
//     by Lance Wicks<lw@judocoach.com>
// 
// This software is designed to listen to the 
// IJF socreboard software and then record data
// and tweet results.
//
// This is Node.js code available on github:
// https://github.com/lancew/ijf.io.git
// ---------------------------------------------

// load the config settings and UDP module
var config = require('./config');
var udp_port = 5000; // var to hold port to bind to so we don't have to scroll to the bottom
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var graph = require('fbgraph');

// ------------------
// vars for data
// -----------------
var state   =   {};
state.t1    =   {};
state.t2    =   {};
state.t3    =   {};
state.t4    =   {};
state.t5    =   {};

state.t1.flag = 0;
state.t2.flag = 0;
state.t3.flag = 0;
state.t4.flag = 0;
state.t5.flag = 0;

var last_facebook_post = 0;

// if we receive a message UDP packet
// ----------------------------------------------------
server.on("message", function (data, rinfo) 
    {
    
        // First convert the data packet to a string, then parse it using the ParseMsg function in this script
        //  Which is basically just mapping the data to the IJF specfication.
        msg = data.toString();
        var data = ParseMsg(msg);

        // Create a timestamp
        var now = new Date();
        var jsonDate = now.toJSON();

        data.timestamp = jsonDate;      // Add the date stamp to the data structure
    
        if (data.MatSending == 1)
        {
            if( 
                      data.Winner     != 0 
                    &&  state.t1.flag   == 0     
                )
            {
                    var message = create_msg(data);
                    post_to_facebook(message);
                    state.t1.flag       = 1;
            }
            else
            {
                if (data.DisplayMode == 1)
                {
                    state.t1.flag = 0; // Reset the flag back to 0
                }
            }
        }



        if (data.MatSending == 2)
        {
            if( 
                      data.Winner     != 0 
                    &&  state.t2.flag   == 0     
                )
            {
                    var message = create_msg(data);
                    post_to_facebook(message);
                    state.t2.flag       = 1;
            }
            else
            {
                if (data.DisplayMode == 1)
                {
                    state.t2.flag = 0; // Reset the flag back to 0
                }
            }
        }



        if (data.MatSending == 3)
        {
            if( 
                      data.Winner     != 0 
                    &&  state.t3.flag   == 0     
                )
            {
                    var message = create_msg(data);
                    post_to_facebook(message);
                    state.t3.flag       = 1;
            }
            else
            {
                if (data.DisplayMode == 1)
                {
                    state.t3.flag = 0; // Reset the flag back to 0
                }
            }
        }




        if (data.MatSending == 4)
        {
            if( 
                      data.Winner     != 0 
                    &&  state.t4.flag   == 0     
                )
            {
                    var message = create_msg(data);
                    post_to_facebook(message);
                    state.t4.flag       = 1;
            }
            else
            {
                if (data.DisplayMode == 1)
                {
                    state.t4.flag = 0; // Reset the flag back to 0
                }
            }
        }



        if (data.MatSending == 5)
        {
            if( 
                      data.Winner     != 0 
                    &&  state.t5.flag   == 0     
                )
            {
                    var message = create_msg(data);
                    post_to_facebook(message);
                    state.t5.flag       = 1;
            }
            else
            {
                if (data.DisplayMode == 1)
                {
                    state.t5.flag = 0; // Reset the flag back to 0
                }
            }
        }







    }
);

// initial listening message on start
// -------------------------------------------
server.on("listening", function () 
    {
        var address = server.address();
        console.log("IJF server listening " + address.address + ":" + address.port);
    }
);


//----------------------------
//   FUNCTIONS
// ----------------------------

function post_to_facebook(msg)
{
   /* Steps:
        1: use api key and secret to obtain token
        2: ?? getr token to write to Judoticker/EJU/IJF feed
        3: Write msg to feed
    */

    var request = require('request'); 
    var t_token = 'BAACEdEose0cBAFy9reZCsx5xUCGjhaVjoZA3u1cU6fR78j7G1MIh8XQBuGwh1vZBc2u3YLGXG0gPCrgGBaze9PEQczkzGcZBbR6q7EYdf2ng0oOZAQtpKhr6jWJ25etzqX3GYX3ZAfXtZBtpho9IWeKo7t5YudFDpYNGQz0kUZBEcJt6T6mVJXM0PA2e5Gn38VEf2PDSp885i0LYSZB2ZA5xvDuwAJAAKZCQGLl1dsoOVrBAAZDZD';
    
    console.log(last_facebook_post);
    console.log('received:' + msg);
    var request_url = "https://graph.facebook.com/oauth/access_token?"
                    +   "client_id=" +  config.facebook.app_id
                    +   "&client_secret=" + config.facebook.app_secret
                    +   "&grant_type=client_credentials";



    if(last_facebook_post != '0')
    {
        // if the last facebook post ID is greater than zero, then we will delete it to keep the top post 
        // a new one.
        var delete_url = 'https://graph.facebook.com/'
                    +  last_facebook_post
                    + '?access_token=' + t_token;

        request.del(delete_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('good-DELETE');
            console.log(body); // Print the google web page.
        
           

        }else{
            console.log('bad-delete');
            console.log(error);
            console.log(response);
        }
    }) 
    }
/*
    var request = require('request');
    request(request_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var a_response = body.split('=');
            access_token = a_response[1];
            console.log(access_token); // Print the google web page.
            

        }
    }) 
 */  
    
    var post_url = 'https://graph.facebook.com/Judoticker/feed'
                    + '?message=' + escape(msg)
                    + '&access_token=' + t_token;
    //console.log("URL:" + post_url);
    request.post(post_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('good');
            console.log(body); // Print the google web page.
        
            var json_body = JSON.parse(body);
            last_facebook_post = json_body.id;



        }else{
            console.log('bad');
            console.log(error);
            console.log(response);
        }
    })                 
}

function create_msg(data) 
{
        var white_score = data.IpponWhite + data.WazaWhite + data.YukoWhite + "(" + data.PenaltyWhite + ")";
        var blue_score = data.IpponBlue + data.WazaBlue + data.YukoBlue + "(" + data.PenaltyBlue + ")";
        var msg = "#";
        msg += data.IDEvent.toUpperCase();
        msg = msg.replace(/^\s+|\s+$/g, '');
        msg += " " + data.Category + "kg";
        msg += " " + data.Round;
        msg += " Mat:";
        msg += data.MatSending;
        msg += " ";
        msg += data.TimerMinute + ":" + data.TimerSecond;
        msg += " " + data.NameWhiteLong;
        msg = msg.replace(/^\s+|\s+$/g, '');
        msg += " #";
        msg += data.NationWhite;
        msg += " ";
        msg += white_score;
        msg += "-";
        msg += blue_score;
        msg += " ";
        msg += data.NameBlueLong;
        msg = msg.replace(/^\s+|\s+$/g, '');
        msg += " #";
        msg += data.NationBlue;
        return(msg);
}

// function to parse data packet from the IJF scoreboard
// ---------------------------------------------------------
function ParseMsg(msg) {
    var data = new Object();
    msg = "." + msg; // Adding one character to make it easier to match the spec in EJU handbook.
    data.ProtoVer = msg.substr(2, 3);
    data.IDEvent = msg.substr(5, 20);
    data.Gender = msg.substr(25, 1);
    data.Category = msg.substr(26, 4);
    data.AgeGroup = msg.substr(30, 1);
    data.Round = msg.substr(21, 1);
    data.ContestID = msg.substr(32, 3);
    data.TimerFlag = msg.substr(35, 1);
    data.TimerMinute = msg.substr(36, 1);
    data.TimerSecond = msg.substr(37, 2);
    data.NationWhite = msg.substr(39, 3);
    data.IDWhite = msg.substr(42, 15);
    data.NameWhiteShort = msg.substr(57, 4);
    data.WRLWhite = msg.substr(61, 3);
    data.NameWhiteLong = msg.substr(64, 30);
    data.IpponWhite = msg.substr(94, 1);
    data.WazaWhite = msg.substr(95, 1);
    data.YukoWhite = msg.substr(96, 1);
    data.PenaltyWhite = msg.substr(97, 1);
    data.TimerOasaeWhite = msg.substr(98, 1);
    data.TeamScoreWhite = msg.substr(100, 1);
    data.NationBlue = msg.substr(101, 3);
    data.IDBlue = msg.substr(104, 15);
    data.NameBlueShort = msg.substr(119, 4);
    data.WRLBlue = msg.substr(123, 3);
    data.NameBlueLong = msg.substr(126, 30);
    data.IpponBlue = msg.substr(156, 1);
    data.WazaBlue = msg.substr(157, 1);
    data.YukoBlue = msg.substr(158, 1);
    data.PenaltyBlue = msg.substr(159, 1);
    data.TimerOsaeBlue = msg.substr(160, 2);
    data.TeamScoreBlue = msg.substr(162, 1);
    data.GoldenScore = msg.substr(163, 1);
    data.Winner = msg.substr(164, 1);
    data.IDReferee = msg.substr(165, 15);
    data.IDJudge1 = msg.substr(180, 15);
    data.IDJudge2 = msg.substr(195, 15);
    data.MatSending = msg.substr(210, 1);
    data.DisplayMode = msg.substr(211, 1); // 1 Logo, 6 Timer
    return (data);
}

// Bind our server object to the correct port
server.bind(udp_port);

/*

   hook.io hook for creating hook.io hooks
   
   ( the ijf_score generates new hooks by inspecting itself )

*/


var Hook = require('hook.io').Hook,
    util = require('util');

var Ijf_score = exports.Ijf_score = function(options){
  Hook.call(this, options);
  var self = this;
};

// Ijf_score inherits from Hook
util.inherits(Ijf_score, Hook);

Ijf_score.prototype.doSomething = function(options, callback){

};

Ijf_score.prototype.doSomethingElse = function(options, callback){

};
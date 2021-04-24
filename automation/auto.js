var async = require('async');
var xlsx = require('node-xlsx');
var schedule = require("node-schedule");
var mysql = require('./sendmail');
var fs = require('fs');
const mail = require('./mailer')

function auto() {
    var j = schedule.scheduleJob('30 * * * * *', function() {
        console.log('this is auto test')
        mail();
    })
}

module.exports = auto;
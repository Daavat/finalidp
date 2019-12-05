const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const mysql = require('mysql');
const http = require('http');
const moment = require('moment');
server.listen(3013);

app.get('/iith.png',function(req,res){
  res.sendFile(__dirname + '/public/img/iith.png');
});

app.get('/',function(req,res){
  res.sendFile(__dirname + '/public/ssdata.html');
  setTimeout(function(){chiller_run_query();}, 10);
  setTimeout(function(){water_run_query();}, 10);
  setTimeout(function(){substation_run_query();}, 10);
});

var ss_con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "bms",
  password: "Sglab_1234",
  database: "IITH_SS_data",
  //socketPath: '/var/run/mysqld/mysqld.sock'
});

var chiller_con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "bms",
  password: "Sglab_1234",
  database: "chiller",
  //socketPath: '/var/run/mysqld/mysqld.sock'
});

var water_con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "bms",
  password: "Sglab_1234",
  database: "water_pumping",
  //socketPath: '/var/run/mysqld/mysqld.sock'
});



function substation_run_query() {
  mid=['2','3','6','7','8','9','11','12','14','16','17','1','24','23','25','26'];
  var i=0;
  for (i=0; i<mid.length; i++){
  ss_con.query("SELECT `meterID`, max(`tstamp`) as time FROM `SS_ems` where `meterID`="+mid[i],
  function (err, result, fields) {
   if (err) throw err;
   ss_meter_result = result;
   //console.log(ss_meter_result);
   io.sockets.emit('substation_meter_data', ss_meter_result);
 });
}
}

function chiller_run_query() {
  chiller_con.query("SELECT max(`timestamp`) as time FROM chiller_ems",
  function (err, result, fields) {
   if (err) throw err;
   chiller_meter_result = result;
   console.log(chiller_meter_result);
   io.sockets.emit('chiller_meter_data', chiller_meter_result);
 });
}

function water_run_query() {
  water_con.query("SELECT max(`tstamp`) as time FROM `water_pumping_data`",
  function (err, result, fields) {
   if (err) throw err;
   water_meter_result = result;
   console.log(water_meter_result);
   io.sockets.emit('water_meter_data', water_meter_result);
 });
}

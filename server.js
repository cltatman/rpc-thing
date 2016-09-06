'use strict';

const Promise = require('bluebird');
const http_server = require('http').createServer();
const socket_server = new require('ws').Server({ server: http_server });
const express_server = require('express')();

const entry_point = require('./server/features/now_check_this_out');


const make_friends = (socket_connection) => {
  const to_client = (request, data) => {
    socket_connection.send(JSON.stringify({ request, data }));

    return new Promise((resolve) => {
      socket_connection.on('message', (message_string) => {
        const message = JSON.parse(message_string);
        if (message.request === request) { resolve(message.data); }
      });
    });
  };

  return {
    to_client,
    to_database: () => { return Promise.resolve(10); }
  };
};


const make_harness = (socket_connection) => {
  const friends = make_friends(socket_connection);
  return (feature) => { Promise.coroutine(feature)(friends); };
};


socket_server.on('connection', (socket_connection) => {
  const run_with_harness = make_harness(socket_connection);
  run_with_harness(entry_point);
});


express_server.get('/', (_, res) => { res.sendFile(__dirname + '/index.html'); });
express_server.get('/client.js', (_, res) => { res.sendFile(__dirname + '/client.js'); });

http_server.on('request', express_server);
http_server.listen(3000);

console.log('autobots roll out 🤖');

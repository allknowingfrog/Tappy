var Board = new require('./board.js');

var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(3000);
var io = require('socket.io')(http);

var request = require('request');

var games = [];
var running = false;

var MAX_TURNS = 100;
var BOARD_SIZE = 5;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('init', function(data, callback) {
        callback(BOARD_SIZE);
    });

    socket.on('challenge', function(endpoints) {
        if(socket.board) socket.board.halt = true;

        console.log('received challenge');

        var edge = BOARD_SIZE - 1;
        var board = new Board(BOARD_SIZE, socket);

        board.addTeam(1, endpoints.left);
        board.addTeam(2, endpoints.right);

        board.addBarrier(2, 2);

        board.addPlayer(1, 0, 0);
        board.addPlayer(2, edge, 0);
        board.addPlayer(1, edge, edge);
        board.addPlayer(2, 0, edge);

        games.push(board);
        socket.board = board;

        socket.emit('update', board.encode());
    });
});

console.log('running');

function process() {
    if(running) return;

    running = true;

    var board;
    while(true) {
        if(!games.length) break;

        board = games.shift();

        if(board.halt) continue;

        var player = board.next();

        var data = {
            url: player.team.endpoint,
            formData: {
                player: JSON.stringify([player.x, player.y]),
                board: JSON.stringify(board.encode())
            }
        };

        request.post(data, function(err, res, body) {
            if(board.move(player, body) < MAX_TURNS) {
                board.socket.emit('update', board.encode());
                var team = board.winner();
                if(team) {
                    board.socket.emit('winner', team.id);
                    board.halt = true;
                    board.socket.board = null;
                } else {
                    if(!board.halt) games.push(board);
                }
            } else {
                board.socket.emit('winner', -1);
                board.halt = true;
                board.socket.board = null;
            }
        });
    }

    running = false;
}

setInterval(process, 1000);

/**/

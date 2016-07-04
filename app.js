var Board = new require('./board.js');

var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(3000);
var io = require('socket.io')(http);

var request = require('request');

var MAX_TURNS = 100;
var BOARD_SIZE = 5;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('challenge', function(endpoints) {
        console.log('received challenge');

        var edge = BOARD_SIZE - 1;
        var board = new Board(BOARD_SIZE);

        board.addTeam(1, endpoints.left);
        board.addTeam(2, endpoints.right);

        board.addBarrier(2, 2);

        board.addPlayer(1, 0, 0);
        board.addPlayer(1, 0, edge);
        board.addPlayer(2, edge, 0);
        board.addPlayer(2, edge, edge);

        process(socket, board);
    });
});

function process(socket, board) {
    var player = board.next();

    var data = {
        url: player.team.endpoint,
        formData: {
            board: JSON.stringify(board.encode(player))
        }
    };

    request.post(data, function(err, res, body) {
        if(board.move(player, parseInt(body)) < MAX_TURNS) {
            socket.emit('update', board.encode(null));
            if(board.play()) {
                process(socket, board);
            }
        } else {
            socket.emit('update', board.encode(null));
        }
    });
}

/**/

console.log('running');

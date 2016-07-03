var Player = new require('./player.js');
var Board = new require('./board.js');

var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(3000);
var io = require('socket.io')(http);

var request = require('request');

var MAX_TURNS = 100;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('challenge', function(endpoints) {
        console.log('received challenge');

        var board = new Board(3, Player);
        board.addPlayer(1, 0, 0, endpoints.left);
        board.addPlayer(2, 2, 2, endpoints.right);

        process(socket, board);
    });
});

function process(socket, board) {
    var player = board.next();

    var data = {
        url: player.endpoint,
        formData: {
            board: JSON.stringify(board.encode()),
            player: player.id
        }
    };

    request.post(data, function(err, res, body) {
        if(board.move(player, parseInt(body)) < MAX_TURNS) {
            socket.emit('update', board.encode());
            if(board.play()) {
                process(socket, board);
            }
        } else {
            socket.emit('update', board.encode());
        }
    });
}

/**/

console.log('running');

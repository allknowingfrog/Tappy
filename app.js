var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(3000);
var io = require('socket.io')(http);

var request = require('request');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('options', function(data, callback) {
        callback(Object.keys(endpoints));
    });

    socket.on('challenge', function(keys) {
        console.log('received challenge');

        var players = [
            endpoints[keys.left],
            endpoints[keys.right]
        ];

        var board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        process(socket, board, players, 1);
    });
});

var endpoints = {
    sequential: 'http://www.jonhastheconch.com/tappy/index.php',
    random: 'http://www.jonhastheconch.com/tappy/player2.php'
};

function process(socket, board, players, player) {
    var data = {
        url: players[player - 1],
        formData: {
            board: JSON.stringify(board)
        }
    };

    request.post(data, function(err, res, body) {
        var move = JSON.parse(body);
        var x = move[0];
        var y = move[1];
        if(board[x][y] == 0) {
            board[x][y] = player;
            print(socket, board);
            if(!stop(board)) {
                player = player == 1 ? 2 : 1;
                process(socket, board, players, player);
            }
        }
    });
}

function print(socket, board) {
    var output;
    for(var y=0; y<board.length; y++) {
        output = '';
        for(var x=0; x<board[y].length; x++) {
            output += board[x][y] + ' ';
        }
    }
    socket.emit('update', board);
}

function stop(board) {
    var done = true;
    for(var y=0; y<board.length; y++) {
        for(var x=0; x<board[y].length; x++) {
            if(board[x][y] == 0) {
                done = false;
                break;
            }
        }
        if(!done) break;
    }

    if(done) return true;

    for(var y=0; y<board.length; y++) {
        if(board[0][y] && board[0][y] == board[1][y] && board[1][y] == board[2][y]) return true;
    }

    for(var x=0; x<board.length; x++) {
        if(board[x][0] && board[x][0] == board[x][1] && board[x][1] == board[x][2]) return true;
    }

    if(board[1][1]) {
        if(board[0][0] == board[1][1] && board[2][2] == board[1][1]) return true;
        if(board[2][0] == board[1][1] && board[0][2] == board[1][1]) return true;
    }

    return false;
}

/**/

console.log('running');

var request = require('request');

var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var url = 'http://www.jonhastheconch.com/tappy/index.php';

function process() {
    var data = {
        url: url,
        formData: {
            board: JSON.stringify(board)
        }
    };

    request.post(data, function(err, res, body) {
        var move = JSON.parse(body);
        var x = move[0];
        var y = move[1];
        if(board[x][y] == 0) {
            board[x][y] = 1;
            print();
            if(!stop()) {
                process();
            }
        }
    });
}

function print() {
    var output;
    for(var y=0; y<board.length; y++) {
        output = '';
        for(var x=0; x<board[y].length; x++) {
            output += board[x][y] + ' ';
        }
        console.log(output);
    }
    console.log('');
}

function stop() {
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

    return done;
}

process();

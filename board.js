module.exports = function(size, Player) {
    var cells = new Array(size);
    var players = [];
    var current = size;
    var turn = 0;

    for(var x=0; x<size; x++) {
        cells[x] = new Array(size);
        for(var y=0; y<size; y++) {
            cells[x][y] = null;
        }
    }

    this.addPlayer = function(id, x, y, end) {
        var player = new Player(id, x, y, end);
        players.push(player);
        cells[x][y] = player;
    };

    this.move = function(player, dir) {
        var x = player.x;
        var y = player.y;

        console.log([x, y, dir]);

        var move = false;
        switch(dir) {
            case 0:
                if(x > 0) {
                    player.x--;
                    move = true;
                }
                break;
            case 1:
                if(y > 0) {
                    player.y--;
                    move = true;
                }
                break;
            case 2:
                if(x < size - 1) {
                    player.x++;
                    move = true;
                }
                break;
            case 3:
                if(y < size - 1) {
                    player.y++;
                    move = true;
                }
                break;
        }

        if(move) {
            cells[x][y] = null;

            if(cells[player.x][player.y] != null) {
                cells[player.x][player.y].alive = false;
            }

            cells[player.x][player.y] = player;
        }

        turn++;

        return turn;
    };

    this.encode = function() {
        var board = new Array(size);
        for(var x=0; x<size; x++) {
            board[x] = new Array(size);
            for(var y=0; y<size; y++) {
                if(cells[x][y] == null) {
                    board[x][y] = 0;
                } else {
                    board[x][y] = cells[x][y].id;
                }
            }
        }

        return board;
    };

    this.play = function() {
        var count = 0;
        for(var i=0; i<players.length; i++) {
            if(players[i].alive) count++;
            if(count > 1) break;
        }

        return count > 1;
    };

    this.next = function() {
        current++;
        if(current >= players.length) current = 0;

        return players[current];
    };
};

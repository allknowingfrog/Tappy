module.exports = function(size, socket) {
    this.socket = socket;

    var cells = new Array(size);
    var teams = {};
    var players = [];
    var current = size;
    var turn = 0;

    for(var x=0; x<size; x++) {
        cells[x] = new Array(size);
        for(var y=0; y<size; y++) {
            cells[x][y] = null;
        }
    }

    this.addTeam = function(id, end) {
        teams[id] = new Team(id, end);
    };

    this.addPlayer = function(team, x, y) {
        var player = new Player(teams[team], x, y);
        players.push(player);
        cells[x][y] = player;
    };

    this.addBarrier = function(x, y) {
        cells[x][y] = new Barrier(x, y);
    };

    this.move = function(player, dir) {
        var x = player.x;
        var y = player.y;

        console.log([x, y, dir]);

        switch(dir) {
            case 0:
                if(x > 0) {
                    x--;
                    update(player, x, y);
                }
                break;
            case 1:
                if(y > 0) {
                    y--;
                    update(player, x, y);
                }
                break;
            case 2:
                if(x < size - 1) {
                    x++;
                    update(player, x, y);
                }
                break;
            case 3:
                if(y < size - 1) {
                    y++;
                    update(player, x, y);
                }
                break;
        }

        turn++;

        return turn;
    };

    function update(player, x, y) {
        if(cells[x][y] instanceof Barrier) return;

        if(cells[x][y] instanceof Player) {
            if(cells[x][y].team == player.team) return;

            cells[x][y].alive = false;
        }

        cells[player.x][player.y] = null;
        cells[x][y] = player;
        player.x = x;
        player.y = y;
    }

    this.encode = function(player) {
        var board = new Array(size);
        var target;
        for(var x=0; x<size; x++) {
            board[x] = new Array(size);
            for(var y=0; y<size; y++) {
                target = cells[x][y];
                if(target == null) {
                    board[x][y] = 0;
                } else if(target instanceof Barrier) {
                    board[x][y] = 8;
                } else if(player) {
                    if(target == player) {
                        board[x][y] = 9;
                    } else if(target.team == player.team) {
                        board[x][y] = 1;
                    } else {
                        board[x][y] = 2;
                    }
                } else {
                    board[x][y] = target.team.id;
                }
            }
        }

        return board;
    };

    this.winner = function() {
        var team;
        for(var i=0; i<players.length; i++) {
            if(players[i].alive) {
                if(team) {
                    if(players[i].team != team) return null;
                } else {
                    team = players[i].team;
                }
            }
        }

        return team;
    };

    this.next = function() {
        while(true) {
            current++;
            if(current >= players.length) current = 0;
            if(players[current].alive) break;
        }

        return players[current];
    };

    function Team(id, end) {
        this.id = id;
        this.endpoint = end;
    }

    function Player(team, x, y) {
        this.team = team;
        this.x = x;
        this.y = y;
        this.alive = true;
    };

    function Barrier(x, y) {
        this.x = x;
        this.y = y;
    };
};

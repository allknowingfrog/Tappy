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
            case 'W':
                if(x > 0) {
                    x--;
                    update(player, x, y);
                }
                break;
            case 'N':
                if(y > 0) {
                    y--;
                    update(player, x, y);
                }
                break;
            case 'E':
                if(x < size - 1) {
                    x++;
                    update(player, x, y);
                }
                break;
            case 'S':
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
        var target = cells[x][y];

        if(target instanceof Barrier) return;

        if(target instanceof Player) {
            if(target.team != player.team) {
                target.health -= 10;
                if(target.health <= 0) cells[x][y] = null;
            }

            return;
        }

        cells[player.x][player.y] = null;
        cells[x][y] = player;
        player.x = x;
        player.y = y;
    }

    this.encode = function() {
        var board = new Array(size);
        var target;
        for(var x=0; x<size; x++) {
            board[x] = new Array(size);
            for(var y=0; y<size; y++) {
                target = cells[x][y];
                if(target == null) {
                    board[x][y] = null;
                } else if(target instanceof Barrier) {
                    board[x][y] = {
                        type: 'barrier'
                    };
                } else {
                    board[x][y] = {
                        type: 'player',
                        health: target.health,
                        team: target.team.id
                    };
                }
            }
        }

        return board;
    };

    this.winner = function() {
        var team;
        for(var i=0; i<players.length; i++) {
            if(players[i].health > 0) {
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
            if(players[current].health > 0) break;
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
        this.health = 100;
    };

    function Barrier(x, y) {
        this.x = x;
        this.y = y;
    };
};

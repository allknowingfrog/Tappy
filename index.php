<?
/*
$board = array(
    array(null,null,null,null,null),
    array(null,null,null,null,null),
    array(null,null,null,null,null),
    array(null,null,null,null,null),
    array(null,null,null,null,null)
);

$board[2][2] = array(
    'type' => 'barrier'
);
$board[3][2] = array(
    'type' => 'player',
    'health' => 100,
    'team' => 1
);
$board[4][2] = array(
    'type' => 'player',
    'health' => 100,
    'team' => 1
);
$board[2][3] = array(
    'type' => 'player',
    'health' => 100,
    'team' => 2
);
$board[2][4] = array(
    'type' => 'player',
    'health' => 100,
    'team' => 2
);

$me = array(2, 3);

$_GET['strategy'] = 'chase';
/**/

$me = json_decode($_POST['player'], true);
$board = json_decode($_POST['board'], true);
$player = $board[$me[0]][$me[1]];

switch($_GET['strategy']) {
    case 'chase':
        $enemies = array();
        foreach($board as $x => $col) {
            foreach($col as $y => $cell) {
                if($cell['type'] == 'player' && $cell['team'] != $player['team']) {
                    $enemies[] = array($x, $y);
                }
            }
        }

        $closest = 1000;
        $target = null;
        foreach($enemies as $enemy) {
            $distance = abs($enemy[0] - $me[0]) + abs($enemy[1] - $me[1]);
            if($distance < $closest) {
                $closest = $distance;
                $target = $enemy;
            }
        }

        $options = array(
            'W' => validMove($player, $board, $me[0] - 1, $me[1]),
            'N' => validMove($player, $board, $me[0], $me[1] - 1),
            'E' => validMove($player, $board, $me[0] + 1, $me[1]),
            'S' => validMove($player, $board, $me[0], $me[1] + 1)
        );

        $dx = $target[0] - $me[0];
        $dy = $target[1] - $me[1];

        $move = null;
        if(abs($dx) >= abs($dy)) {
            if($dx <= 0 && $options['W']) {
                $move = 'W';
            } elseif($options['E']) {
                $move = 'E';
            }
        }

        if(!$move) {
            if($dy <= 0 && $options['N']) {
                $move = 'N';
            } elseif($options['S']) {
                $move = 'S';
            }
        }

        echo $move;

        break;

    case 'run':
        if(validMove($player, $board, $me[0]-1, $me[1], true)) {
            echo 'W';
        } elseif(validMove($player, $board, $me[0], $me[1]-1, true)) {
            echo 'N';
        } elseif(validMove($player, $board, $me[0]+1, $me[1], true)) {
            echo 'E';
        } elseif(validMove($player, $board, $me[0], $me[1]+1, true)) {
            echo 'S';
        } else {
            $options = array('W', 'N', 'E', 'S');
            $index = rand(0, 3);
            echo $options[$index];
        }

        break;

    default:
        $options = array('W', 'N', 'E', 'S');
        $index = rand(0, 3);
        echo $options[$index];
}

function validMove($player, $board, $x, $y, $run=false) {
    if($x < 0 || $x >= count($board)) return false;
    if($y < 0 || $y >= count($board)) return false;

    $tmp = $board[$x][$y];
    if($tmp['type'] == 'barrier') return false;
    if($tmp['type'] == 'player') {
        if($run) return false;
        if($tmp['team'] == $player['team']) return false;
    }

    return true;
}
?>

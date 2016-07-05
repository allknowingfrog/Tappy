<?
$board = json_decode($_POST['board']);

switch($_GET['strategy']) {
    case 'chase':
        $enemies = array();
        foreach($board as $x => $col) {
            foreach($col as $y => $cell) {
                if($cell == 2) {
                    $enemies[] = array($x, $y);
                } elseif($cell == 9) {
                    $me = array($x, $y);
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

        $dx = $target[0] - $me[0];
        $dy = $target[1] - $me[1];

        if($dx > 0) {
            $x = 2;
        } else {
            $x = 0;
        }

        if($dy > 0) {
            $y = 3;
        } else {
            $y = 1;
        }

        $xValid = false;
        $yValid = false;

        if($x == 2) {
            $tmp = $board[$me[0] + 1][$me[1]];
            if($tmp == 0 || $tmp == 2) {
                $xValid = true;
            }
        } else {
            $tmp = $board[$me[0] - 1][$me[1]];
            if($tmp == 0 || $tmp == 2) {
                $xValid = true;
            }
        }

        if($y == 3) {
            $tmp = $board[$me[0]][$me[1] + 1];
            if($tmp == 0 || $tmp == 2) {
                $yValid = true;
            }
        } else {
            $tmp = $board[$me[0]][$me[1] - 1];
            if($tmp == 0 || $tmp == 2) {
                $yValid = true;
            }
        }

        if(!$xValid) {
            echo $y;
        } elseif(!$yValid) {
            echo $x;
        } elseif(abs($dx) > abs($dy)) {
            echo $x;
        } else {
            echo $y;
        }

        break;

    case 'run':
        $done = false;
        foreach($board as $x => $col) {
            foreach($col as $y => $cell) {
                if($cell == 9) {
                    $me = array($x, $y);
                    $done = true;
                    break;
                }
            }
            if($done) break;
        }

        if($board[$me[0]+1][$me[1]] == 2) {
            echo 0;
        } elseif($board[$me[0]][$me[1]+1] == 2) {
            echo 1;
        } elseif($board[$me[0]-1][$me[1]] == 2) {
            echo 2;
        } elseif($board[$me[0]][$me[1]-1] == 2) {
            echo 3;
        } else {
            echo rand(0, 3);
        }

        break;

    default:
        echo rand(0, 3);
}

/*
if(true) {
    $board = array(
        array(0,0,0,0,0),
        array(0,0,0,0,0),
        array(0,0,8,0,0),
        array(0,0,0,0,0),
        array(0,0,0,0,0)
    );

    $board[0][0] = 2;
    $board[2][0] = 1;
    $board[2][4] = 2;
    $board[1][4] = 9;

    for($y=0; $y<5; $y++) {
        for($x=0; $x<5; $x++) {
            echo $board[$x][$y] . ' ';
        }
        echo "\n";
    }
*/
?>

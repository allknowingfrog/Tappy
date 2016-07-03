<?
    $board = json_decode($_POST['board']);

    if($_POST['player'] == 2) {
        foreach($board as $x => $col) {
            foreach($col as $y => $cell) {
                if($cell == 1) {
                    $x1 = $x;
                    $y1 = $y;
                } elseif($cell == 2) {
                    $x2 = $x;
                    $y2 = $y;
                }
            }
        }

        $dx = $x1 - $x2;
        $dy = $y1 - $y2;

        if(abs($dx) > abs($dy)) {
            if($dx > 0) {
                echo 2;
            } else {
                echo 0;
            }
        } else {
            if($dy > 0) {
                echo 3;
            } else {
                echo 1;
            }
        }

    } else {
        echo rand(0, 3);
    }
?>

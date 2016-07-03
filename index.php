<?
    $board = json_decode($_POST['board']);
    $done = false;
    foreach($board as $x => $col) {
        foreach($col as $y => $cell) {
            if($cell == 0) {
                $done = true;
                break;
            }
        }
        if($done) break;
    }

    if($done) echo json_encode(array($x, $y));
    else echo 'fail';
?>

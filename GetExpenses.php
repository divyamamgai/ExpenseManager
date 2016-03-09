<?php
header('Content-Type: application/json');
$UsersData = file_get_contents('expenses.txt');
$Users = preg_split('/[|]/', $UsersData);
$UsersCount = count($Users);
$Food = array();
$Travel = array();
$Other = array();
$l = $UsersCount - 1;
$i = 0;
for (; $i < $UsersCount; $i++) {
    $Expenses = preg_split('/[#]/', $Users[$i]);
    if (count($Expenses) == 3) {
        array_push($Food, preg_split('/[,]/', $Expenses[0]));
        array_push($Travel, preg_split('/[,]/', $Expenses[1]));
        array_push($Other, preg_split('/[,]/', $Expenses[2]));
    } else die('error');
}
echo '{"Food":[';
$i = 0;
for (; $i < $UsersCount; $i++) {
    echo '[';
    $FoodCount = count($Food[$i]);
    $m = $FoodCount - 1;
    $j = 0;
    for (; $j < $FoodCount; $j++) {
        $FoodEntry = preg_split('/[:]/', $Food[$i][$j]);
        if (count($FoodEntry) == 2) {
            echo '{"Description":"' . $FoodEntry[0] . '","Amount":' . $FoodEntry[1] . '}' . ($j < $m ? ',' : '');
        }
    }
    echo ']' . ($i < $l ? ',' : '');
}
echo '],"Travel":[';
$i = 0;
for (; $i < $UsersCount; $i++) {
    echo '[';
    $TravelCount = count($Travel[$i]);
    $m = $TravelCount - 1;
    $j = 0;
    for (; $j < $TravelCount; $j++) {
        $TravelEntry = preg_split('/[:]/', $Travel[$i][$j]);
        if (count($TravelEntry) == 2) {
            echo '{"Description":"' . $TravelEntry[0] . '","Amount":' . $TravelEntry[1] . '}' . ($j < $m ? ',' : '');
        }
    }
    echo ']' . ($i < $l ? ',' : '');
}
echo '],"Other":[';
$i = 0;
for (; $i < $UsersCount; $i++) {
    echo '[';
    $OtherCount = count($Other[$i]);
    $m = $OtherCount - 1;
    $j = 0;
    for (; $j < $OtherCount; $j++) {
        $OtherEntry = preg_split('/[:]/', $Other[$i][$j]);
        if (count($OtherEntry) == 2) {
            echo '{"Description":"' . $OtherEntry[0] . '","Amount":' . $OtherEntry[1] . '}' . ($j < $m ? ',' : '');
        }
    }
    echo ']' . ($i < $l ? ',' : '');
}
echo ']}';
